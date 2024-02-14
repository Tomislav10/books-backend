import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {UserEntity} from '../entity/user.entity';
import bcryptjs from 'bcryptjs'

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

    res.send(user);
}
