import express from 'express';
import { morganConfig, sessionConfig } from './configs';
import passport from './lib/passport';
import routers from './routes';
import { errorHandler } from './middlewares';

const app = express();

app.use(morganConfig);
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', ...routers);
app.use(errorHandler);

export default app;
