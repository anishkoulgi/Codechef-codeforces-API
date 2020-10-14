import redis from 'redis';
import { NextFunction, Response, Request } from 'express';

const REDIS_PORT: any = process.env.REDIS_PORT || 6379;
const client = redis.createClient({
  host: 'redis-server',
  port: REDIS_PORT,
});

export const cache = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  client.get(username, (err, data) => {
    if (err) throw err;
    if (data != null) {
      res.json(JSON.parse(data));
    } else next();
  });
};

export const insert = (data: any, username: string) => {
  client.setex(username, 3600, JSON.stringify(data));
};
