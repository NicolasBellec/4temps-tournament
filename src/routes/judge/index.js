// @flow

import { Router } from 'express';
import type { Router as RouterTy } from 'express';
import { allow } from '../auth-middleware';
import createJudgeRoute from './create-judge';
import loginJudgeRoute from './login-judge';
import { TournamentRepositoryImpl } from '../../data/tournament';
import AccessKeyRepositoryImpl from '../../data/access-key';

const router: RouterTy<ServerApiRequest, ServerApiResponse> = Router();
const tournamentRepository = new TournamentRepositoryImpl();
const accessKeyRepository = new AccessKeyRepositoryImpl();

router.post(
  '/login',
  allow('public'),
  loginJudgeRoute(tournamentRepository, accessKeyRepository),
);

router.post(
  '/:tournamentId/create',
  allow('admin'),
  createJudgeRoute(tournamentRepository, accessKeyRepository),
);

export default router;
