require('dotenv').config();

import cookieParser from 'cookie-parser';
import express from 'express';
import {createConnection} from 'typeorm';
import {routes} from './routes';
import cors from 'cors';

createConnection().then(() => {
    console.log('Connected !!!!');

    const app = express();

    app.use(express.json());
    app.use(cookieParser())
    app.use(cors({
        origin: ['http://localhost:4200'],
        credentials: true
    }));

    routes(app);

    app.listen(8000, () => {
        console.log('listttteeenn 8000')
    })
})
