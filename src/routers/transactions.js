import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';

const router = express();

router.use(authenticate);
