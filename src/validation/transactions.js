import Joi from 'joi';
import { CATEGORIES } from '../constants/index.js';
import { isValidObjectId } from 'mongoose';

export const createTransactionSchema = Joi.object({
  date: Joi.date().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string()
    .valid(CATEGORIES.INCOME, ...CATEGORIES.EXPENSE)
    .required(),
  comment: Joi.string().min(3).max(30).required(),
  sum: Joi.number().positive().required(),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('user ID is not valid');
    }
    return true;
  }),
});

export const updateTransactionSchema = Joi.object({
  date: Joi.date(),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().valid(CATEGORIES.INCOME, ...CATEGORIES.EXPENSE),
  comment: Joi.string().min(3).max(30),
  sum: Joi.number().positive(),
});
