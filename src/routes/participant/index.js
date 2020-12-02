// @flow

import { Router } from 'express'
import type { Router as RouterTy } from 'express'
import { allow } from '../auth-middleware'

import { TournamentRepositoryImpl } from '../../data/tournament'
import { CreateParticipantRoute } from './create-participant'
import { BatchCreateParticipantRoute } from './batch-create-participant'
import ChangeAttendance from './change-attendance'

const router: RouterTy<ServerApiRequest, ServerApiResponse> = Router()
const tournamentRepository = new TournamentRepositoryImpl()

const createParticipantRoute = new CreateParticipantRoute(tournamentRepository)
router.post('/:tournamentId/create', allow('admin', 'assistant'), createParticipantRoute.route)

const batchCreateParticipantRoute = new BatchCreateParticipantRoute(tournamentRepository)
router.post('/:tournamentId/batch-create', allow('admin', 'assistant'), batchCreateParticipantRoute.route)

const changeAttendance = new ChangeAttendance(tournamentRepository)
router.post('/:tournamentId/attendance', allow('admin', 'assistant'), changeAttendance.route)

export default router
