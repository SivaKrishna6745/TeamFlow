import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { tasksData } from './mockData';

const PORT: number = 8080;
const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/api/tasks', (req: Request, res: Response) => {
    setTimeout(() => {
        res.status(200).json({ data: tasksData });
    }, 500);
});

app.post('/api/tasks', (req: Request, res: Response) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newTask = {
        ...req.body,
        id,
        createdAt,
    };
    tasksData.push(newTask);
    res.status(201).json({ data: newTask });
});

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Server</h1>');
});

app.listen(PORT, () => console.log(`app started listening successfully on port ${PORT}`));
