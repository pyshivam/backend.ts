import { Router } from 'express';

import validation from '@core/middlewares/validate.middleware';
import loginValidation from './auth.validation';
import login from './auth.controller';

const router: Router = Router();

router.post('/auth/login', [validation(loginValidation)], login);

export default router;
