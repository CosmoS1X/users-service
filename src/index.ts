import express from 'express';
import { morganConfig } from './configs';

const app = express();

app.use(morganConfig);
app.use(express.json());

export default app;
