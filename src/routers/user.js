import { Router } from 'express';
import { isValidUserId } from '../middlewares/isValidUserId.js';
import { authenticate } from '../middlewares/authenticate.js';
import * as userController from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { upload } from '../middlewares/upload.js';

import { validateBody } from '../middlewares/validateBody.js';
import * as userValidSchema from '../validation/user.js';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get(
  '/current',
  ctrlWrapper(userController.getCurrentUserController),
);

userRouter.get(
  '/:id',
  isValidUserId,
  ctrlWrapper(userController.getUserByIdController),
);

userRouter.patch(
  '/:id',
  isValidUserId,
  upload.single('avatar'),
  ctrlWrapper(userController.updateUserController),
);

export default userRouter;
