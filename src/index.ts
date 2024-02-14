import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createConnection } from 'typeorm';
import { routes } from './routes';
import cors from 'cors';

const startServer = async () => {
    try {
        await createConnection();
        console.log('Connected to the database!');

        const app = express();

        app.use(express.json());
        app.use(cookieParser());
        app.use(cors({
            origin: ['http://localhost:4200'],
            credentials: true
        }));

        routes(app);

        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

startServer().catch(error => console.error('Unhandled promise rejection:', error));;
