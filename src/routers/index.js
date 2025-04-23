import { Router } from 'express';
import transactionsRouter from './transactions.js';
import authRouter from './auth.js';
import userRouter from './user.js';

const router = Router();

router.use('/transactions', transactionsRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
