// @flow

import { Router } from 'express';
import type { Router as RouterTy } from 'express';
import { allow } from '../auth-middleware';
import AccessKeyRepositoryImpl from '../../data/access-key';
import loginRoute from './login';

const router: RouterTy<ServerApiRequest, ServerApiResponse> = Router();

router.get(
  '/:tournamentId',
  allow('admin'),
  async (req: ServerApiRequest, res: ServerApiResponse) => {
    const repo = new AccessKeyRepositoryImpl();
    res.json(await repo.getForTournament(req.params.tournamentId));
  },
);

router.post(
  '/login',
  allow('public'),
  loginRoute(new AccessKeyRepositoryImpl()),
);

export default router;
