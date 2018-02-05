// @flow
import type {Tournament} from '../src/models/tournament';
import type {Participant} from '../src/models/participant';
import type { AdminLoginValidationSummary } from
  '../src/validators/validate-admin-login';
import type { TournamentValidationSummary } from
  '../src/validators/validate-tournament';
import type { ParticipantValidationSummary } from
  '../src/validators/validate-participant';
import type { AdminCreateValidationSummary } from
  '../src/validators/validate-admin';


// Base types

declare type RoundCriterion = {
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  type: 'none' | 'both' | 'one' | 'follower' | 'leader'
}

declare type Round = {
  id: string,
  name: string,
  danceCount: number,
  minPairCount: number,
  maxPairCount: number,
  tieRule: 'none' | 'random' | 'all',
  roundScoringRule: 'none' | 'average' | 'averageWithoutOutliers',
  multipleDanceScoringRule: 'none' | 'average' | 'best' | 'worst',
  criteria: Array<RoundCriterion>,
  active: boolean,
  finished: boolean,
  groups: Array<DanceGroup>
}

declare type DanceGroup = {
  pairs: Array<Pair>
}

declare type Pair = {
  follower: ?string,
  leader: ?string
}

declare type AccessKey = {
  userId: string,
  tournamentId: string,
  key: string,
}

declare type Judge = {
  id: string,
  name: string
}

declare type PermissionRole = 'public' | 'admin' | 'authenticated' | 'judge';

// Express interface
declare interface ServerApiRequest {
  session: { user: ?{ id: string, role: PermissionRole } };
  body: { [string]: mixed };
  query: { [name: string]: string };
  params: {[param: string]: string};
}

declare interface ServerApiResponse {
  status(statusCode: number): ServerApiResponse;
  sendStatus(statusCode: number): ServerApiResponse;
  json(body?: mixed): ServerApiResponse;
}

// Validation types
declare type RoundValidationSummary = {
  isValidRound: boolean,
  isValidName: boolean,
  isValidDanceCount: boolean,
  isValidMinPairCount: boolean,
  isValidMaxPairCount: boolean,
  isMaxPairGreaterOrEqualToMinPair: boolean,
  isValidTieRule: boolean,
  isValidRoundScoringRule: boolean,
  isValidMultipleDanceScoringRule: boolean,
  isValidAmountOfCriteria: boolean,
  isValidCriteria: boolean,
  criteriaValidation: Array<{
    isValidCriterion: boolean,
    isValidName: boolean,
    isValidMinValue: boolean,
    isValidMaxValue: boolean,
    isValidValueCombination: boolean,
    isValidType: boolean,
    isValidDescription: boolean
  }>
}


// Redux
declare type ReduxDispatch = (action: ReduxAction) => mixed;
declare type ReduxState = {
  user: UserReduxState,
  tournaments: TournamentsReduxState,
  participants: ParticipantsReduxState,
  rounds: RoundsReduxState,
  judges: JudgesReduxState,

  ui: {
    judgeLogin: UiJudgeLoginReduxState,
    login: UiLoginReduxState,
    signUp: UiSignUpReduxState,

    createTournament: UiCreateTournamentsReduxState,
    editTournament: UiEditTournamentsReduxState,

    createParticipant: UiCreateParticipantsReduxState,
    createRound: UiCreateRoundReduxState,
    createJudge: UiCreateJudgeReduxState
  }
};

declare type UserReduxState = {
  id: string
}

declare type TournamentsReduxState = {
  isLoading: boolean,
  isInvalidated: boolean,
  didLoadAdminTournaments: boolean,

  forAdmin: Array<string>,
  allIds: Array<string>,
  byId: {
    [id: string]: Tournament
  },
}

declare type ParticipantsReduxState = {
  isLoading: boolean,

  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Participant
  },
}

declare type RoundsReduxState = {
  isLoading: boolean,
  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Round
  }
}

declare type JudgesReduxState = {
  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Judge
  }
}

declare type UiLoginReduxState = {
  isLoading: boolean,
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesAdminExist: boolean
}

declare type UiJudgeLoginReduxState = {
  isLoading: boolean,
  isValidAccessKey: boolean,
  doesAccessKeyExist: boolean
}

declare type UiSignUpReduxState = {
  isLoading: boolean,
  validation: AdminCreateValidationSummary
}

declare type UiCreateTournamentsReduxState = {
  isLoading: boolean,
  validation: TournamentValidationSummary
}

declare type UiEditTournamentsReduxState = {
  isValidName: boolean,
  isValidDate: boolean
}

declare type UiCreateParticipantsReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: ParticipantValidationSummary
}

declare type UiCreateRoundReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: RoundValidationSummary
}

declare type UiCreateJudgeReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  isValid: boolean
}

declare type ReduxPackAction = {
  type: string,
  payload: any
}

declare type ReduxAction = LogoutAction | LoginAction
  | GetAllTournamentsAction | GetAdminTournamentsAction
  | CreateTournamentAction | EditTournamentAction
  | CreateParticipantAction
  | SignUpAction | CreateRoundAction
  | DeleteRoundAction | CreateJudgeAction | StartRoundAction | LoginJudgeAction;

// Redux Actions
declare type LogoutAction =
  {
    type: 'LOGOUT_USER',
    promise: Promise<boolean>,
    meta: {
      onSuccess: () => mixed
    }
  };

declare type LoginAction =
  {
    type: 'LOGIN_USER',
    promise: Promise<AdminLoginValidationSummary>,
    meta: {
      onSuccess: () => mixed
    }
  };

declare type GetAllTournamentsAction =
  { type: 'GET_ALL_TOURNAMENTS', promise: Promise<mixed> };

declare type GetAdminTournamentsAction =
  { type: 'GET_ADMIN_TOURNAMENTS', promise: Promise<mixed> };

declare type CreateTournamentAction =
  {
    type: 'CREATE_TOURNAMENT',
    promise: Promise<Tournament>,
    meta: {
      onSuccess: (tournament: Tournament) => mixed
    }
  };
declare type EditTournamentAction =
  { type: 'EDIT_TOURNAMENT', promise: Promise<Tournament> };

declare type CreateParticipantAction =
  {
    type: 'CREATE_PARTICIPANT',
    promise: Promise<{ tournamentId: string, participant: Participant }>
  };

declare type SignUpAction =
  {
    type: 'SIGNUP',
    promise: Promise<AdminCreateValidationSummary>,
    meta: {
      onSuccess: () => mixed
    }
  };

declare type CreateRoundAction =
  {
    type: 'CREATE_ROUND',
    promise: Promise<Round>
  }

declare type DeleteRoundAction =
  {
    type: 'DELETE_ROUND',
    promise: Promise<{tournamentId: string, roundId: string}>
  }

declare type CreateJudgeAction =
  {
    type: 'CREATE_JUDGE',
    promise: Promise<mixed>
  }

declare type StartRoundAction = {
  type: 'START_ROUND',
  promise: Promise<mixed>
}
declare type LoginJudgeAction = {
  type: 'LOGIN_WITH_ACCESS_KEY',
  promise: any
}
