import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import * as userController from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { upload } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userUpdateSchema } from '../validation/user.js';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get(
  '/current',
  ctrlWrapper(userController.getCurrentUserDataController),
);

userRouter.patch(
  '/update',
  upload.single('avatar'),
  validateBody(userUpdateSchema),
  ctrlWrapper(userController.updateUserController),
);

export default userRouter;
