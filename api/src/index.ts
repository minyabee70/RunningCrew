import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AppError } from './errors/AppError';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import sessionsRouter from './routes/sessions';
import analysisRouter from './routes/analysis';
import analyticsRouter from './routes/analytics';
import usersRouter from './routes/users';
import adminRouter from './routes/admin';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(
  cors({
    origin: process.env.WEB_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/sessions', analysisRouter);
app.use('/api', analyticsRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
});
