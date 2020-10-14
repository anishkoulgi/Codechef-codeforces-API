import express from 'express';
import cheerio from 'cheerio';
import axios from 'axios';

import { getText, getTextWithSplit } from '../utils/getText';
import { insert, cache } from '../redis-client';

const router = express.Router();

router.get('/:username', cache, async (req, res) => {
  try {
    const response = await axios.get(
      `https://codechef.com/users/${req.params.username}`
    );
    const $ = cheerio.load(response.data);

    let personalInfo: any = {};
    $(
      'body > main > div > div > div > div > div > section.user-details > ul'
    ).each((idx, ul) => {
      const children = $(ul).children();
      let num = $(children).length;
      children.each((i, li) => {
        if (i !== num - 1) {
          const children = $(li).children();
          let key: any, value: any;
          children.each((i, a) => {
            if (i) value = getText($, false, a);
            else key = getTextWithSplit($, false, a, ':');
          });
          personalInfo[key] = value;
        }
      });
    });
    if (!personalInfo.Username) {
      res.status(404).json({
        isValid: false,
      });
    } else {
      const globalRank = getText(
        $,
        true,
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(1) > a > strong'
      );

      const countryRank = getText(
        $,
        true,
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(2) > a > strong'
      );

      const codechefRating = getText(
        $,
        true,
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div.rating-number'
      );

      const stars = getText(
        $,
        true,
        'body > main > div > div > div > div > div > section.user-details > ul > li:nth-child(1) > span > span.rating'
      );

      const maxRating = parseInt(
        (getText(
          $,
          false,
          'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > small'
        ) as string)
          .replace(/[()]/g, '')
          .split(' ')[2]
      );

      let rating: any = {};
      $('#hp-sidebar-blurbRating > div > table > tbody').each((idx, tb) => {
        const children = $(tb).children();
        children.each((i, tr) => {
          const cols = $(tr).children();
          let key: any = null,
            value: any = null;
          cols.each((i, td) => {
            const ele = getText($, false, td);

            if (i === 1) value = parseInt(ele as string);
            else if (i === 0) key = ele;
            if (key && value) rating[key] = value;
          });
        });
      });

      const user = {
        username: req.params.username,
        rank: {
          globalRank,
          countryRank,
        },
        codechefRating,
        stars,
        maxRating,
        personalInfo,
        rating,
        isValid: true,
      };
      insert(user, req.params.username);
      res.json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Some error occured');
  }
});

export default router;
