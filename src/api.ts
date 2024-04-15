import { Router } from 'express';

import healthCheck from '@components/healthcheck/healthCheck.router';
import user from '@components/user/user.router';
import auth from '@components/auth/auth.router';

const router: Router = Router();
router.use(healthCheck);
router.use(user);
router.use(auth);

export default router;
