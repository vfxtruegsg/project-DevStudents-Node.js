// src/validation/auth.js
import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(6).max(64).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(6).max(64).required(),
});
