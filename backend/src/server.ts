import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { tasksData } from './mockData';

const PORT: number = 8080;
const app: Express = express();

app.use(cors());

app.get('/api/tasks', (req: Request, res: Response) => {
    setTimeout(() => {
        res.status(200).json({ data: tasksData });
    }, 500);
});

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Server</h1>');
});

app.listen(PORT, () => console.log(`app started listening successfully on port ${PORT}`));
