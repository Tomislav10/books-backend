import express from 'express';
import {createConnection} from 'typeorm';
import {routes} from './routes';

createConnection().then(() => {
    console.log('Connected !!!!');

    const app = express();

    app.use(express.json());

    routes(app);

    app.listen(8000, () => {
        console.log('listttteeenn 8000')
    })
})
