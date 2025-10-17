import morgan from 'morgan';

export const morganConfig = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev');
