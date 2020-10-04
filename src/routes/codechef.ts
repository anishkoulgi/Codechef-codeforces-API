import express from 'express';
import cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const response = await axios.get(
      `https://codechef.com/users/${req.params.username}`
    );
    const $ = cheerio.load(response.data);
    const globalRank = parseInt(
      $(
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(1) > a > strong'
      )
        .text()
        .trim()
    );

    const countryRank = parseInt(
      $(
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(2) > a > strong'
      ).text()
    );

    const codechefRating = parseInt(
      $(
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div.rating-number'
      )
        .text()
        .trim()
    );

    const stars = parseInt(
      $(
        'body > main > div > div > div > div > div > section.user-details > ul > li:nth-child(1) > span > span.rating'
      ).text()[0]
    );

    const maxRating = parseInt(
      $(
        'body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > small'
      )
        .text()
        .replace(/[()]/g, '')
        .split(' ')[2]
    );

    let personalInfo: any = {};
    $(
      'body > main > div > div > div > div > div > section.user-details > ul'
    ).each((idx, ul) => {
      const children = $(ul).children();
      children.each((i, li) => {
        if (i !== 6 && i !== 0) {
          const children = $(li).children();
          let key: any, value: any;
          children.each((i, a) => {
            if (i) value = $(a).text().trim();
            else key = $(a).text().trim();
          });
          personalInfo[key] = value;
        }
      });
    });

    let rating: any = {};
    $('#hp-sidebar-blurbRating > div > table > tbody').each((idx, tb) => {
      const children = $(tb).children();
      children.each((i, tr) => {
        const cols = $(tr).children();
        let key: any = null,
          value: any = null;
        cols.each((i, td) => {
          const ele = $(td).text().trim();

          if (i === 1) value = parseInt(ele.trim());
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
    };
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Some error occured');
  }
});

export default router;
