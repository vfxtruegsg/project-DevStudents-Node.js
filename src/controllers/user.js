import * as userServices from '../services/user.js';
import * as cloudUse from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

export const getCurrentUserDataController = async (req, res) => {
  const userData = req.user;

  const data = await userServices.getUserById(userData._id);

  if (!data) {
    throw createHttpError(404, `User with id=${userData._id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found user with id=${userData._id}`,
    data,
  });
};

export const updateUserController = async (req, res) => {
  const userData = req.user;
  const updates = { ...req.body };

  const user = await userServices.getUserById(userData._id);
  if (!user) {
    throw createHttpError(404, `User with id=${userData._id} not found`);
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

  const result = await userServices.updateUser({ _id: userData._id }, updates);

  if (!result || !result.data) {
    throw createHttpError(500, 'Failed to update user');
  }

  res.json({
    status: 200,
    message: `User with id=${userData._id} updated successfully`,
    data: result.data,
  });
};
