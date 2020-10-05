import express from 'express';
import cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

router.get('/:username', async (req, res) => {
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
      username: req.params.username,
      rank,
      rating,
      maxRank,
      maxRating,
    };
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Some error occured');
  }
});

export default router;
