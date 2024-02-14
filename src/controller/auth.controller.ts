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
