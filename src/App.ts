import express, { Request, Response } from 'express';
import cors from 'cors';

import cf from './routes/codeforces';

const app = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: '🚀Welcome to Codeforchef!' });
});

app.use('/codeforces', cf);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀[server]: Server is running at https://localhost:${PORT}`);
});
