import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {UserEntity} from '../entity/user.entity';
import bcryptjs from 'bcryptjs'
import {sign} from 'jsonwebtoken';

export const Register = async (req: Request, res: Response) => {
    const {first_name, last_name, email, password, password_confirm} = req.body;

    if(password !== password_confirm) {
        return res.status(400).send({
            message: 'Password!!!!! '
        })
    }



    const user = await getRepository(UserEntity).save({
        first_name,
        last_name,
        email,
        password: await bcryptjs.hash(password, 12),
    })

    res.send(user);
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
    }, "access_secret", {expiresIn: '30s'});

    const refreshToken = sign({
        id: user.id
    }, "refresh_secret", {expiresIn: '1w'});

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
