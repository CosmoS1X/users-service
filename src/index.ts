import express from 'express';
import { morganConfig } from './configs';
import { errorHandler } from './middlewares';

const app = express();

app.use(morganConfig);
app.use(express.json());
app.use(errorHandler);

export default app;
