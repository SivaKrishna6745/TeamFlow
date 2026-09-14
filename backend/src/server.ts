import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';

const PORT: number = 8080;
const app: Express = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Server</h1>');
});

app.listen(PORT, () => console.log(`app started listening successfully on port ${PORT}`));
