import express, { Request, Response } from 'express';
import cors from 'cors';

import cf from './routes/codeforces';
import cc from './routes/codechef';

const app = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: '🚀Welcome to Codeforchef!' });
});

app.use('/codeforces', cf);
app.use('/codechef', cc);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀[server]: Server is running at https://localhost:${PORT}`);
});
