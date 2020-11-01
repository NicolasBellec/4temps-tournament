# Action

`LOGOUT_USER`:
  <!-- promise: Promise < boolean > ,
  meta: {
    onSuccess: () => mixed
  } -->


`LOGIN_USER`:
  <!-- promise: Promise < AdminLoginValidationSummary > ,
  meta: {
    onSuccess: () => mixed
  } -->

`GET_ALL_TOURNAMENTS`:
  <!-- promise: Promise < mixed > -->


declare type GetAdminTournamentsAction = {
  type: 'GET_ADMIN_TOURNAMENTS',
  promise: Promise < mixed >
};

declare type TournamentUpdatedAction = {
  type: 'TOURNAMENT_UPDATED',
  payload: mixed
};

declare type CreateTournamentAction = {
  type: 'CREATE_TOURNAMENT',
  promise: Promise < Tournament > ,
  meta: {
    onSuccess: (tournament: Tournament) => mixed
  }
};
declare type EditTournamentAction = {
  type: 'EDIT_TOURNAMENT',
  promise: Promise < Tournament >
};

declare type CreateParticipantAction = {
  type: 'CREATE_PARTICIPANT',
  promise: Promise < {
    tournamentId: string,
    participant: Participant
  } >
};

declare type SignUpAction = {
  type: 'SIGNUP',
  promise: Promise < AdminCreateValidationSummary > ,
  meta: {
    onSuccess: () => mixed
  }
};

declare type CreateRoundAction = {
  type: 'CREATE_ROUND',
  promise: Promise < Round >
};

declare type DeleteRoundAction = {
  type: 'DELETE_ROUND',
  promise: Promise < {
    tournamentId: string,
    roundId: string
  } >
};

declare type CreateJudgeAction = {
  type: 'CREATE_JUDGE',
  promise: Promise < mixed >
};

declare type CreateAssistantAction = {
  type: 'CREATE_ASSISTANT',
  promise: Promise < mixed >
};

declare type StartRoundAction = {
  type: 'START_ROUND',
  promise: Promise < mixed >
};
declare type LoginJudgeAction = {
  type: 'LOGIN_WITH_ACCESS_KEY',
  promise: mixed
};

declare type GetAccessKeys = {
  type: 'GET_ACCESS_KEYS',
  promise: mixed
};

declare type StartNextDanceAction = {
  type: 'START_NEXT_DANCE',
  promise: mixed
};

declare type ChangeAttendance = {
  type: 'CHANGE_ATTENDANCE',
  promise: mixed
};

declare type GetJudgeTournament = {
  type: 'GET_JUDGE_TOURNAMENT',
  promise: mixed
};

declare type GetSingleTournament = {
  type: 'GET_SINGLE_TOURNAMENT',
  promise: mixed
};

declare type GenerateGroupsAction = {
  type: 'GENERATE_GROUPS',
  promise: mixed
};

declare type EndDanceAction = {
  type: 'END_DANCE',
  promise: mixed
};

declare type GetNotesAction = {
  type: 'GET_NOTES',
  promise: mixed
};

declare type SetNoteAction = {
  type: 'SET_NOTE',
  promise: mixed
};

declare type SelectPairAction = {
  type: 'SELECT_PAIR',
  payload: string
};

declare type GetLeaderboardAction = {
  type: 'GET_LEADERBOARD',
  promise: mixed
};

declare type SettleDrawAction = {
  type: 'SETTLE_DRAW',
  promise: mixed
};
