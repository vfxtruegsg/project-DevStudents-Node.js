import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';
import { setupSession } from '../utils/setupSession.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const { email, password } = req.body;

  const session = await loginUser({ email, password });

  setupSession(res, session.session);

  const cleanUserData = {
    name: user.name,
    email: user.email,
    balance: user.balance,
    avatar: user.avatar.url,
    _id: user._id,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user and logged in!',
    data: {
      ...cleanUserData,
      accessToken: session.session.accessToken,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { session, user } = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      userId: user._id,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  console.log(session);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
