import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();

app.use(cors());

app.get('/api/:username', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://codeforces.com/profile/${req.params.username}`
    );
    const $ = cheerio.load(response.data);
    const rank = $(
      '#pageContent > div:nth-child(3) > div.userbox > div.info > div > div.user-rank > span'
    )
      .text()
      .trim();
    const rating = $(
      '#pageContent > div:nth-child(3) > div.userbox > div.info > ul > li:nth-child(1) > span'
    )
      .text()
      .split(' ')[0]
      .trim();
    const maxRank = $(
      '#pageContent > div:nth-child(3) > div.userbox > div.info > ul > li:nth-child(1) > span.smaller > span:nth-child(1)'
    )
      .text()
      .split(',')[0];
    const maxRating = $(
      '#pageContent > div:nth-child(3) > div.userbox > div.info > ul > li:nth-child(1) > span.smaller > span:nth-child(2)'
    ).text();
    const user = {
      rank,
      rating,
      maxRank,
      maxRating,
    };
    res.json(user);
  } catch (err) {
    res.status(500).send('Some error occured');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
