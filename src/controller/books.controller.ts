import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {BookEntity} from '../entity/book.entity';

export const addFavorites = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const {userId, url} = req.body;

        const user = await getRepository(BookEntity).findOne({
            where: {
                userId,
                url
            },
        });

        if (user) {
            return res.status(200).send({
                message: 'Already updated!',
            });
        }

        await getRepository(BookEntity).save({userId, ...req.body});

        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
};

export const removeFavorites = async (req: Request, res: Response) => {
    try {
        const {userId, url} = req.body;

        const user = await getRepository(BookEntity).findOne({
            where: {
                userId,
                url
            },
        });

        if (!user) {
            return res.status(200).send({
                message: 'Already updated!',
            });
        }

        await getRepository(BookEntity).delete(user);

        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
        try {
            const {userId} = req.params;

            if (!userId) {
                return res.status(400).send({
                    message: 'userId missing!',
                });
            }

            const books = await getRepository(BookEntity).find({
                    where: {
                        userId
                    }
                },
            )

            res.status(200).send(books);
        } catch
            (error) {
            res.status(500).send({
                message: (error as Error).message,
            });
        }
    }
;
