import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validation/transactions.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createTransactionController,
  deleteTransactionController,
  getAllTransactionsController,
  getTransactionsCategoryController,
  updateTransactionController,
} from '../controllers/transactions.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllTransactionsController));

router.post(
  '/',
  validateBody(createTransactionSchema),
  ctrlWrapper(createTransactionController),
);

router.patch(
  '/:transactionId',
  isValidId,
  validateBody(updateTransactionSchema),
  ctrlWrapper(updateTransactionController),
);

router.delete(
  '/:transactionId',
  isValidId,
  ctrlWrapper(deleteTransactionController),
);

router.get('/categories', ctrlWrapper(getTransactionsCategoryController));
export default router;
