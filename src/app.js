import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { analyzerRouter } from './routes/analyzerRoutes.js';
import { rulesRouter } from './routes/rulesRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
export function createApp() { const app = express(); app.use(helmet()); app.use(cors()); app.use(express.json({ limit: '1mb' })); app.use(morgan('combined')); app.use('/api', analyzerRouter); app.use('/api', rulesRouter); app.use(notFound); app.use(errorHandler); return app; }
