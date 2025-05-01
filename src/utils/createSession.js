import { randomBytes } from 'crypto';
import { ONE_DAY, THREE_HOURS } from '../constants/index.js';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THREE_HOURS),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};
