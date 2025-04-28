import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().pattern(emailRegexp).max(64).required(),
  password: Joi.string().min(6).max(64).required(),
  balance: Joi.number(),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().messages({
    'string.max': 'The maximum name length is 30 characters',
  }),
});
