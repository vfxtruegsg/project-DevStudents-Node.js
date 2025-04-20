import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const userSchema = Joi.object({
  name: Joi.string().max(32),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(64).required(),
  balance: Joi.number().max(15000),
  oldPassword: Joi.string().min(6).max(64),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().max(32).optional().messages({
    'string.max': 'The maximum name length is 32 characters',
  }),
  email: Joi.string().pattern(emailRegexp).optional().messages({
    'string.email': 'Invalid email format',
  }),
  oldPassword: Joi.string().min(6).max(64).optional(),
  newPassword: Joi.string().min(6).max(64).optional(),
});
