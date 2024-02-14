import express, {Request, Response} from 'express';
import {createConnection} from 'typeorm';

createConnection().then(() => {
    console.log('Conected !!!!')
})

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('tessstttt!!!!')
});

app.listen(8000, () => {
    console.log('listttteeenn 8000')
})

console.log('hello55')
