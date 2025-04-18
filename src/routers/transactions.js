import { authenticate } from '../middlewares/authenticate.js';

router.use(authenticate);

router.get('/', ctrlWrapper(getStudentsController));
