import { startServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';
import { createDirIfNotExist } from './middlewares/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from './constants/index.js';
const bootstrap = async () => {
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
  await initMongoDB();
  startServer();
};

bootstrap();
