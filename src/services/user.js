import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

export const getUserById = async (id) => {
  const user = await UsersCollection.findById(id);

  if (!user) {
    return null;
  }
  return user;
};

export const getUser = (filter) => UsersCollection.findOne(filter);

export const updateUser = async (filter, update, options = {}) => {
  const { upsert = false } = options;

  const result = await UsersCollection.findOneAndUpdate(filter, update, {
    new: true,
    upsert,
    rawResult: true,
  });

  if (!result || !result.value) return null;

  return {
    isNew: Boolean(result.lastErrorObject?.upserted),
    data: result.value,
  };
};
export const getSession = (filter) => SessionsCollection.findOne(filter);
