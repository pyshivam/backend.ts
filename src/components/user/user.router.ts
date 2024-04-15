import { Router } from 'express';

import validation from '@core/middlewares/validate.middleware';
import checkAuth from '@core/middlewares/checkAuth.middleware';
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
} from './user.controller';
import createUserValidation from './createUser.validation';

const router: Router = Router();

// e.g. createUser request's body is validated and protected by api-key
router.post('/user/', [validation(createUserValidation)], createUser);
router.get('/user/', [checkAuth], readUser);
router.put('/user/:id', [checkAuth], updateUser);
router.delete('/user/:id', [checkAuth], deleteUser);

export default router;
