import morgan from 'morgan';
import session from 'express-session';

export const morganConfig = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev');

const devSessionKey = 'cdf49a999da33791f7646f7c5e5874c66b1247c5db7cc77e9d6a7844430cfc43d98f1160eeef3a91b2c6409ae9b4147f8920ec5fa6743b4d82700b310a918a3a';

export const sessionConfig = session({
  secret: process.env.SESSION_KEY || devSessionKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
  },
  unset: 'destroy',
  rolling: true,
});
