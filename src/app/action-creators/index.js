// no-flow
import {
  getTournamentsForUser,
  getTournamentForJudge,
  getTournament
} from '../api/tournament';
import { subscribeToUpdatesForTournaments } from '../api/realtime';
import { createTournamentApi } from '../../api/tournament';
import {
  GET_ADMIN_TOURNAMENTS,
  GET_JUDGE_TOURNAMENT,
  GET_SINGLE_TOURNAMENT,
  CREATE_TOURNAMENT
} from './action-types';

export const getAdminTournaments = () => ({
    type: GET_ADMIN_TOURNAMENTS,
    promise: getTournamentsForUser(),
    meta: {
      onSuccess: (_, getState) =>
        subscribeToUpdatesForTournaments(getState().tournaments.forAdmin)
    }
});

export function getJudgeTournament(dispatch: ReduxDispatch) {
  dispatch({
    type: GET_JUDGE_TOURNAMENT,
    promise: getTournamentForJudge(),
    meta: {
      onSuccess: (_, getState) =>
        subscribeToUpdatesForTournaments([getState().tournaments.forJudge])
    }
  });
}

export function getSingleTournament(
  dispatch: ReduxDispatch,
  tournamentId: string
) {
  dispatch({
    type: GET_SINGLE_TOURNAMENT,
    promise: getTournament(tournamentId),
    meta: {
      onSuccess: () => subscribeToUpdatesForTournaments([tournamentId])
    }
  });
}

export createTournamentAction(name: string, date: Moment, type: TournamentType,
  history: RouterHistory): CreateTournamentAction {
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
      dancesNoted: {}
    }),
    meta: {
      onSuccess: ({ id }: Tournament): void =>
        history.push(`/tournament/edit/${id}`)
    }
  }
}
