import { rateLimit } from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    status: 429,
    message: 'Request limit exceeded, please try again later!',
  },
});
