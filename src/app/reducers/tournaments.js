// @flow
import { handle } from 'redux-pack'

function tournaments(
  state: TournamentsReduxState = getInitialState(),
  action: ReduxPackAction
): TournamentsReduxState {
  const { type } = action

  switch (type) {
    case 'GET_ALL_TOURNAMENTS':
      return getAllTournaments(state, action)
    case 'GET_ADMIN_TOURNAMENTS':
      return getUserTournaments(state, action)
    case 'GET_JUDGE_TOURNAMENT':
    case 'GET_SINGLE_TOURNAMENT':
      return getJudgeTournament(state, action)
    case 'CREATE_TOURNAMENT':
      return createTournament(state, action)
    case 'EDIT_TOURNAMENT':
      return editTournament(state, action)
    case 'TOURNAMENT_UPDATED':
      return tournamentUpdated(state, action)
    case 'LOGOUT_USER':
      return logout(state, action)
    default:
      return state
  }
}

export function getInitialState(): TournamentsReduxState {
  return {
    isLoading: false,
    isInvalidated: true,
    didLoadAdminTournaments: false,
    forJudge: '',
    forAdmin: [],
    allIds: [],
    byId: {},
  }
}

function getAllTournaments(
  state: TournamentsReduxState,
  action: ReduxPackAction
): TournamentsReduxState {
  const { payload } = action
  return handle(state, action, {
    start: (prevState) => ({ ...prevState, isLoading: true }),
    success: (prevState) => ({
      ...prevState,
      isLoading: false,
      isInvalidated: false,
      allIds: payload.result,
      byId: payload.entities.tournaments,
    }),
    failure: (prevState) => ({
      ...prevState,
      isLoading: false,
      isInvalidated: false,
    }),
  })
}

function getUserTournaments(
  state: TournamentsReduxState,
  action: ReduxPackAction
): TournamentsReduxState {
  const { payload } = action
  return handle(state, action, {
    start: (prevState) => ({ ...prevState, isLoading: true }),
    success: (prevState) => ({
      ...prevState,
      isLoading: false,
      didLoadAdminTournaments: true,
      forAdmin: payload.result,
      allIds: Array.from(new Set([...prevState.allIds, ...payload.result]).values()),
      byId: {
        ...prevState.byId,
        ...payload.entities.tournaments,
      },
    }),
    failure: (prevState) => ({ ...prevState, isLoading: false }),
  })
}

function getJudgeTournament(state: TournamentsReduxState, action: ReduxPackAction) {
  const { payload } = action
  return handle(state, action, {
    start: (prevState) => ({ ...prevState, isLoading: true }),
    success: (prevState) => ({
      ...prevState,
      isLoading: false,
      forJudge: payload.result,
      allIds: Array.from(new Set([...prevState.allIds, payload.result]).values()),
      byId: {
        ...prevState.byId,
        ...payload.entities.tournaments,
      },
    }),
    failure: (prevState) => ({ ...prevState, isLoading: false }),
  })
}

function createTournament(
  state: TournamentsReduxState,
  action: ReduxPackAction
): TournamentsReduxState {
  const { payload } = action

  return handle(state, action, {
    success: (prevState) => ({
      ...prevState,
      allIds: [...prevState.allIds, payload.id],
      byId: { ...prevState.byId, [payload.id]: payload },
      forAdmin: [...prevState.forAdmin, payload.id],
    }),
  })
}

function editTournament(
  state: TournamentsReduxState,
  action: ReduxPackAction
): TournamentsReduxState {
  const { payload } = action

  return handle(state, action, {
    success: (prevState) => ({
      ...prevState,
      byId: {
        ...prevState.byId,
        [payload.id]: payload,
      },
    }),
  })
}

function logout(state: TournamentsReduxState, action: ReduxPackAction): TournamentsReduxState {
  return handle(state, action, {
    success: (prevState) => ({
      ...prevState,
      forAdmin: [],
      forJudge: '',
      didLoadAdminTournaments: false,
    }),
  })
}

function tournamentUpdated(state: TournamentsReduxState, action: ReduxPackAction) {
  const { payload } = action
  return {
    ...state,
    byId: {
      ...state.byId,
      ...payload.entities.tournaments,
    },
  }
}

export default tournaments
