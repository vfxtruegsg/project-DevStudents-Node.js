import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import * as userController from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { upload } from '../middlewares/upload.js';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get(
  '/current',
  ctrlWrapper(userController.getCurrentUserDataController),
);

userRouter.patch(
  '/update',
  upload.single('avatar'),
  ctrlWrapper(userController.updateUserController),
);

export default userRouter;
