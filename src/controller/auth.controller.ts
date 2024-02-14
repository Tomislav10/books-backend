import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
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
            message: 'Password!!!!! '
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
    console.log('aaaa');
    const {first_name, last_name, email, password, password_confirm} = req.body;

    const user = await getRepository(UserEntity).findOne({
        where: {
            email: email,
        },
    });

    if(!user) {
        return res.status(404).send({
            message: 'Not found. Invalid credentials!!!!! '
        })
    }

    if(!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Wrong pass. Invalid credentials!!!!! '
        })
    }

    const accessToken = sign({
        id: user.id
    }, process.env.ACCESS_SECRET || '', {expiresIn: '30s'});

    const refreshToken = sign({
        id: user.id
    }, process.env.REFRESH_SECRET || '', {expiresIn: '1w'});

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 24*60*60*1000 // 24h
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 24*60*60*1000*7 // 7days
    });

    res.send({
        accessToken,
        refreshToken
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['access_token'];

        const payload = verify(cookie, process.env.ACCESS_SECRET || '') as JwtPayload;

        if(!payload){
            return res.status(401).send({
                message: 'Unauthenticated.a..sd.a.s.'
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
                message: 'Unauthenticated.a..sd.a.s.'
            })
        }

        const {password, ...data} = user;

        res.send(data);
    } catch (e) {
        return res.status(401).send({
            message: 'Unauthenticated.a..sd.a.s.'
        })
    }
}

export const Refresh = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['refresh_token'];

        const payload = verify(cookie, process.env.REFRESH_SECRET || '') as JwtPayload;

        if(!payload){
            return res.status(401).send({
                message: 'Unauthenticated.a..sd.a.s.'
            })
        }

        const accessToken = sign({
            id: payload.id
        }, process.env.ACCESS_SECRET || '', {expiresIn: '30s'});

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24*60*60*1000 // 24h
        });

        res.send({
            message: 'Success'
        });

    } catch (e) {
        return res.status(401).send({
            message: 'Unauthenticated.a..sd.a.s.'
        })
    }
}
