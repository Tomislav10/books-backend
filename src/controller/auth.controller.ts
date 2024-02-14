import {Request, Response} from 'express';
import {getRepository, MoreThanOrEqual} from 'typeorm';
import {TokenEntity} from '../entity/token.entity';
import {UserEntity} from '../entity/user.entity';
import bcryptjs from 'bcryptjs'
import {sign, verify} from 'jsonwebtoken';

interface JwtPayload {
    id: number,
    iat: number,
    exp: number
}

export const Register = async (req: Request, res: Response) => {
    const {first_name, last_name, email, password_confirm} = req.body;

    if(req.body.password !== password_confirm) {
        return res.status(400).send({
            message: 'Passwords do not match'
        })
    }

    const {password, ...data} = await getRepository(UserEntity).save({
        first_name,
        last_name,
        email,
        password: await bcryptjs.hash(req.body.password, 12),
    })

    res.send(data);
}

export const Login = async (req: Request, res: Response) => {
    const user = await getRepository(UserEntity).findOne({
        where: {
            email: req.body.email,
        },
    });

    if(!user) {
        return res.status(404).send({
            message: 'User not found!'
        })
    }

    if(!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Invalid credentials!'
        })
    }

    const refreshToken = sign({
        id: user.id
    }, process.env.REFRESH_SECRET || '', {expiresIn: '1w'});

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 24*60*60*1000*7 // 7days
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await getRepository(TokenEntity).save({
       user_id: user.id,
        token: refreshToken,
        expired_at
    });

    const token = sign({
        id: user.id
    }, process.env.ACCESS_SECRET || '', {expiresIn: '30s'});

    res.send({
        token
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const accessToken = (req.header('Authorization') as string)?.split(' ')[1] || '';

        const payload = verify(accessToken, process.env.ACCESS_SECRET || '') as JwtPayload;

        if(!payload){
            return res.status(401).send({
                message: 'Unauthenticated request'
            })
        }

        console.log(payload);

        const user = await getRepository(UserEntity).findOne({
            where: {
                id: payload.id,
            },
        });

        if(!user){
            return res.status(401).send({
                message: 'Unauthenticated request'
            })
        }

        const {password, ...data} = user;

        res.send(data);
    } catch (e) {
        return res.status(401).send({
            message: 'Unauthenticated request'
        })
    }
}

export const Refresh = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['refresh_token'];

        const payload = verify(cookie, process.env.REFRESH_SECRET || '') as JwtPayload;

        if(!payload){
            return res.status(401).send({
                message: 'Unauthenticated request'
            })
        }

        const refreshToken = await getRepository(TokenEntity).findOne({
            where: {
                user_id: payload.id,
                expired_at: MoreThanOrEqual(new Date())
            },
        });

        if(!payload){
            return res.status(401).send({
                message: 'Unauthenticated request'
            })
        }

        const token = sign({
            id: payload.id
        }, process.env.ACCESS_SECRET || '', {expiresIn: '30s'});

        res.send({
            token
        });

    } catch (e) {
        return res.status(401).send({
            message: 'Unauthenticated request'
        })
    }
}

export const Logout = async (req: Request, res: Response) => {
    const token = req.cookies['refresh_token'];
    await getRepository(TokenEntity).delete({token})

    res.cookie('refresh_token', '', {maxAge: 0});

    res.send({
        message: 'Success'
    });
}
