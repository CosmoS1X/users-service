import express from 'express';
import { morganConfig } from './configs';
import routers from './routes';
import { errorHandler } from './middlewares';

const app = express();

app.use(morganConfig);
app.use(express.json());
app.use('/api', ...routers);
app.use(errorHandler);

export default app;
