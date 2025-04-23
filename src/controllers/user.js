import createError from 'http-errors';
import * as userServices from '../services/user.js';

import * as cloudUse from '../utils/saveFileToCloudinary.js';
import { getSession, resetPassword } from '../services/auth.js';
import createHttpError from 'http-errors';

export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await userServices.getUserById(id);

  if (!data) {
    throw createError(404, `User with id=${id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found user with id=${id}`,
    data,
  });
};

export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const user = await userServices.getUserById(id);
  if (!user) {
    throw createError(404, `User with id=${id} not found`);
  }

  if (req.file) {
    if (user.avatar?.public_id && user.avatar.public_id !== 'default-avatar') {
      await cloudUse.deleteFileFromCloudinary(user.avatar.public_id);
    }

    const avatarData = await cloudUse.saveAvatarToCloudinary(req.file);
    updates.avatar = {
      url: avatarData.url,
      public_id: avatarData.public_id,
    };
  }

  const result = await userServices.updateUser({ _id: id }, updates);

  if (!result || !result.data) {
    throw createError(500, 'Failed to update user');
  }

  res.json({
    status: 200,
    message: `User with id=${id} updated successfully`,
    data: result.data,
  });
};

export const getCurrentUserController = async (req, res, next) => {
  const user = req.user;
  const session = await getSession({ userId: user._id });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  res.json({
    status: 200,
    message: 'User data retrieved successfully',
    data: {
      userId: user._id,
      accessToken: session.accessToken,
      sessionId: session._id,
    },
  });
};
