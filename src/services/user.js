import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';

export const getUserById = async (id) => {
  const user = await UsersCollection.findById(id);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  return user;
};

export const updateUser = async (filter, update, options = {}) => {
  const { upsert = false } = options;

  const result = await UsersCollection.findOneAndUpdate(filter, update, {
    new: true,
    includeResultMetadata: true,
    upsert,
    rawResult: true,
  });

  if (!result || !result.value) throw createHttpError(404, 'Not found!');

  return {
    isNew: Boolean(result.lastErrorObject?.upserted),
    data: result.value,
  };
};
