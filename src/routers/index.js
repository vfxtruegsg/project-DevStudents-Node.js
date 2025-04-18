import { Router } from 'express';
// import transactionsRouter from './transactions.js';
import authRouter from './auth.js';

const router = Router();

// router.use('/transaction', transactionsRouter);
router.use('/auth', authRouter);

export default router;
