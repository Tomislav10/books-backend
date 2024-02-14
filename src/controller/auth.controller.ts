import { Request, Response } from 'express';
import { getRepository, MoreThanOrEqual } from 'typeorm';
import { TokenEntity } from '../entity/token.entity';
import { UserEntity } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    iat: number;
    exp: number;
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password_confirm } = req.body;

        if (!first_name || !last_name || !email || !req.body.password || req.body.password !== password_confirm) {
            return res.status(400).send({
                message: 'Invalid or missing data in the request body',
            });
        }

        const { password, ...data } = await getRepository(UserEntity).save({
            first_name,
            last_name,
            email,
            password: await bcryptjs.hash(req.body.password, 12),
        });

        res.status(201).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Internal Server Error',
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const user = await getRepository(UserEntity).findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(404).send({
                message: 'User not found!',
            });
        }

        if (!(await bcryptjs.compare(req.body.password, user.password))) {
            return res.status(400).send({
                message: 'Invalid credentials!',
            });
        }

        const refreshToken = sign({ id: user.id }, process.env.REFRESH_SECRET || '', { expiresIn: '1w' });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
        });

        const expired_at = new Date();
        expired_at.setDate(expired_at.getDate() + 7);

        await getRepository(TokenEntity).save({
            user_id: user.id,
            token: refreshToken,
            expired_at,
        });

        const token = sign({ id: user.id }, process.env.ACCESS_SECRET || '', { expiresIn: '30s' });

        res.send({
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Internal Server Error',
        });
    }
};


export const getAuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const accessToken = (req.header('Authorization') as string)?.split(' ')[1] || '';

        const payload = verify(accessToken, process.env.ACCESS_SECRET || '') as JwtPayload;

        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated request',
            });
        }

        const user = await getRepository(UserEntity).findOne({
            where: {
                id: payload.id,
            },
        });

        if (!user) {
            return res.status(401).send({
                message: 'Unauthenticated request',
            });
        }

        const { password, ...data } = user;

        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(401).send({
            message: 'Unauthenticated request!',
        });
    }
};

export const refreshAuthToken = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['refresh_token'];

        const payload = verify(cookie, process.env.REFRESH_SECRET || '') as JwtPayload;

        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated request',
            });
        }

        const refreshToken = await getRepository(TokenEntity).findOne({
            where: {
                user_id: payload.id,
                expired_at: MoreThanOrEqual(new Date()),
            },
        });

        if (!refreshToken) {
            return res.status(401).send({
                message: 'Unauthenticated request',
            });
        }

        const token = sign({ id: payload.id }, process.env.ACCESS_SECRET || '', { expiresIn: '30s' });

        res.send({
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(401).send({
            message: 'Unauthenticated request',
        });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies['refresh_token'];
        await getRepository(TokenEntity).delete({ token });

        res.cookie('refresh_token', '', { maxAge: 0 });

        res.status(200).send({
            message: 'Logout successful',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Internal Server Error',
        });
    }
};
