import express from 'express';
import cheerio from 'cheerio';
import axios from 'axios';

import { getText, getTextWithSplit } from '../utils/getText';
import { insert, cache } from '../redis-client';

const router = express.Router();

router.get('/:username', cache, async (req, res) => {
  try {
    const response = await axios.get(
      `https://codeforces.com/profile/${req.params.username}`
    );

    const $ = cheerio.load(response.data);

    const userName = getText(
      $,
      false,
      '#pageContent > div:nth-child(3) > div.userbox > div.info > div > h1 > a'
    ) as string;
    if (!userName.length) {
      const user = { isValid: false };
      res.status(404).json(user);
    } else {
      const rank = getText(
        $,
        false,
        '#pageContent > div:nth-child(3) > div.userbox > div.info > div > div.user-rank > span'
      );
      const rating = getTextWithSplit(
        $,
        true,
        '#pageContent > div:nth-child(3) > div.userbox > div.info > ul > li:nth-child(1) > span',
        ' '
      );
      const maxRank = getTextWithSplit(
        $,
        false,
        '#pageContent > div:nth-child(3) > div.userbox > div.info > ul > li:nth-child(1) > span.smaller > span:nth-child(1)',
        ','
      );
      const maxRating = getText(
        $,
        true,
        '#pageContent > div:nth-child(3) > div.userbox > div.info > ul > li:nth-child(1) > span.smaller > span:nth-child(2)'
      );
      const user = {
        username: userName,
        rank,
        rating,
        maxRank,
        maxRating,
        isValid: true,
      };
      insert(user, userName);
      res.json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Some error occured');
  }
});

export default router;
