import express from 'express';
import cors from 'cors';
import { env } from './infrastructure/config/env';
import { router } from './interface/http/routes/index';
import { errorHandler, notFoundHandler } from './interface/http/middlewares/errorHandler';

export const app = express();

app.use(cors({ origin: env.frontendUrls }));
app.use(express.json());

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);