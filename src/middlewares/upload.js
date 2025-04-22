import multer from 'multer';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(createHttpError(400, 'Only image files are allowed'));
  }

  const extension = file.originalname.split('.').pop().toLowerCase();

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!allowedExtensions.includes(extension)) {
    return cb(
      createHttpError(
        400,
        `File extension .${extension} is not allowed. Use: ${allowedExtensions.join(
          ', ',
        )}`,
      ),
    );
  }
  if (extension === 'exe') {
    return cb(createHttpError(400, 'file with .exe extention not allow'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
