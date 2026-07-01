import { Router } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'running-crew-api' });
});

router.get('/db', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    next(err);
  }
});

export default router;
