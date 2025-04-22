import createError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidUserId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(createError(404, `${id} not valid id`));
  }
  next();
};
