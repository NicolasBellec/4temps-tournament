// @flow
import { Router } from 'express';
import type { Router as RouterTy } from 'express';

import createAdmin from './create-admin';
import loginAdmin from './login-admin';
import logoutAdmin from './logout-admin';

const router: RouterTy<ServerApiRequest, ServerApiResponse> = Router();

router.post('/create', createAdmin);

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

export default router;
