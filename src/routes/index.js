// @flow

import { Router } from 'express';
import type { Router as RouterTy } from 'express';

import AdminRoute from './admin';
import AccessKeyRoute from './access-key';
import TournamentRoute from './tournament';
import ParticipantRoute from './participant';
import RoundRoute from './round';
import JudgeRoute from './judge';
import AssistantRoute from './assistant';
import NoteRoute from './note';
import LeaderboardRoute from './leaderboard';

const router: RouterTy<ServerApiRequest, ServerApiResponse> = Router();

router.use('/admin', AdminRoute);
router.use('/access-key', AccessKeyRoute);
router.use('/tournament', TournamentRoute);
router.use('/participant', ParticipantRoute);
router.use('/round', RoundRoute);
router.use('/judge', JudgeRoute);
router.use('/assistant', AssistantRoute);
router.use('/note', NoteRoute);
router.use('/leaderboard', LeaderboardRoute);

export default router;
