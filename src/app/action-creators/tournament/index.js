// no-flow

import type { RouterHistory } from 'react-router-dom';
import type Moment from 'moment';
import ObjectId from 'bson-objectid';
import {
  getTournamentsForUser,
  getTournamentForJudge,
  getTournament,
  createTournamentApi,
  updateTournament,
} from '../../api/tournament';
import {
  GET_ADMIN_TOURNAMENTS,
  GET_JUDGE_TOURNAMENT,
  GET_SINGLE_TOURNAMENT,
  CREATE_TOURNAMENT,
  EDIT_TOURNAMENT,
} from '../../action-types';
import { subscribeToUpdatesForTournaments } from '../../api/realtime';

export function getAdminTournamentsAction(): GetAdminTournamentsAction {
  return {
    type: GET_ADMIN_TOURNAMENTS,
    promise: getTournamentsForUser(),
    meta: {
      onSuccess: (_, getState) => subscribeToUpdatesForTournaments(getState().tournaments.forAdmin),
    },
  };
}

export function getJudgeTournamentAction(): GetJudgeTournamentAction {
  return {
    type: GET_JUDGE_TOURNAMENT,
    promise: getTournamentForJudge(),
    meta: {
      onSuccess: (_, getState) => subscribeToUpdatesForTournaments([getState().tournaments.forJudge]),
    },
  };
}

export function getSingleTournamentAction(
  tournamentId: string,
): GetSingleTournamentAction {
  return {
    type: GET_SINGLE_TOURNAMENT,
    promise: getTournament(tournamentId),
    meta: {
      onSuccess: () => subscribeToUpdatesForTournaments([tournamentId]),
    },
  };
}

export function getCreateTournamentAction(
  name: string,
  date: Moment,
  type: TournamentType,
  history: RouterHistory,
): CreateTournamentAction {
  return {
    type: CREATE_TOURNAMENT,
    promise: createTournamentApi({
      id: ObjectId.generate(),
      creatorId: '',
      name,
      date,
      type,
      judges: [],
      assistants: [],
      participants: [],
      rounds: [],
      dancesNoted: {},
    }),
    meta: {
      onSuccess: ({ id }: Tournament): void => history.push(`/tournament/edit/${id}`),
    },
  };
}

export function getEditTournamentAction(
  tournamentId: string,
  tournament: Tournament,
): EditTournamentAction {
  return {
    type: EDIT_TOURNAMENT,
    promise: updateTournament(tournamentId, tournament),
  };
}
