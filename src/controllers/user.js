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

export const updateUserAvatarController = async (req, res) => {
  const { id } = req.params;
  const avatar = req.file;

  if (!avatar) {
    console.error('No avatar file provided');
    throw createError(400, 'Avatar file is required');
  }

  console.log('Getting user by ID:', id);
  const user = await userServices.getUserById(id);
  if (!user) {
    console.error(`User with id=${id} not found`);
    throw createError(404, `User with id=${id} not found`);
  }

  if (user.avatar?.public_id && user.avatar.public_id !== 'default-avatar') {
    console.log('Deleting old avatar from Cloudinary');
    await cloudUse.deleteFileFromCloudinary(user.avatar.public_id);
  }

  const avatarData = await cloudUse.saveAvatarToCloudinary(avatar);
  console.log('Cloudinary upload response:', avatarData);

  const result = await userServices.updateUser(
    { _id: id },
    {
      avatar: {
        url: avatarData.url,
        public_id: avatarData.public_id,
      },
    },
  );

  if (!result || !result.data || !result.data.avatar) {
    throw createError(500, 'Failed to update user avatar');
  }

  const updatedUser = result.data || result;

  res.json({
    status: 200,
    message: 'Avatar updated successfully',
    data: {
      avatarUrl: result.data.avatar.url,
    },
  });
};

export const updateUserController = async (req, res) => {
  const { id } = req.params;

  const userData = req.body || {};
  const user = await userServices.getUserById(id);
  if (!user) {
    throw createError(404, `User with id=${id} not found`);
  }

  const result = await userServices.updateUser({ _id: id }, userData);

  res.json({
    status: 200,
    message: `User with id=${id} updated successfully`,
    data: result,
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
