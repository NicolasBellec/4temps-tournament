// @flow
import type Moment from 'moment';

// Base types

declare type TournamentType = 'none' | 'jj' | 'classic';

declare type Tournament = {
  id: string,
  creatorId: string,
  name: string,
  date: Moment,
  type: TournamentType,
  dancesNoted: {
    [judgeId: string]: Array < string >
  },
  judges: Array < Judge > ,
  assistants: Array < Assistant > ,
  participants: Array < Participant > ,
  rounds: Array < Round > ,
};

declare type ParticipantRole =
  | 'none'
  | 'leader'
  | 'follower'
  | 'leaderAndFollower';

declare type Participant = {
  id: string,
  attendanceId: number,
  name: string,
  role: ParticipantRole,
  isAttending: boolean
};

declare type RoundCriterion = {
  id: string,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  forJudgeType: JudgeType,
};

declare type MultipleDanceScoringRule = 'none' | 'average' | 'best';
declare type NotationSystem = 'none' | 'sum' | 'rpss';

declare type Round = {
  id: string,
  name: string,
  danceCount: number,
  minPairCountPerGroup: number,
  maxPairCountPerGroup: number,
  passingCouplesCount: number,
  errorOnSameScore: boolean,
  multipleDanceScoringRule: MultipleDanceScoringRule,
  notationSystem: NotationSystem,
  criteria: Array < RoundCriterion > ,
  active: boolean,
  finished: boolean,
  draw: boolean,
  groups: Array < DanceGroup > ,
  roundScores: Array < Score > ,
  tieBreakerJudge: ? string,
  winners: {
    leaders: Array<{ score: number, participant: Participant }>,
    followers: Array<{ score: number, participant: Participant }>,
  }
};

declare type Score = {
  participantId: string,
  score: number
};

declare type DanceGroup = {
  id: string,
  pairs: Array < Pair > ,
  dances: Array < Dance >
};

declare type Dance = {
  id: string,
  active: boolean,
  finished: boolean
};

declare type Pair = {
  follower: ? string,
  leader: ? string
};

declare type AccessKey = {
  userId: string,
  tournamentId: string,
  key: string,
  role: 'judge' | 'assistant'
};

declare type JudgeType = 'normal' | 'sanctioner' | 'president';

declare type Judge = {
  id: string,
  name: string,
  judgeType: JudgeType
};

declare type JudgeNote = {
  judgeId: string,
  danceId: string,
  criterionId: string,
  participantId: string,
  value: number
};

declare type Admin = {
  id: string,
  firstName: string,
  lastName: string,
  email: string
};

declare type AdminWithPassword = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
};

declare type AdminCredentials = {
  email: string,
  password: string
};

declare type User = {
  id: string,
  role: PermissionRole,
  tournamentId?: string,
};

declare type PermissionRole =
  | 'public'
  | 'admin'
  | 'authenticated'
  | 'judge'
  | 'assistant';

declare type Assistant = {
  id: string,
  name: string
};

declare type Leaderboard = {
  tournamentId: string,
  rounds: Array < LeaderboardRound > ,
  remainingParticipants: Array < Participant > ,
  tournamentName: string
};

declare type LeaderboardRound = {
  roundId: string,
  name: string,
  isFinished: boolean,
  winningLeaderScores: Array < LeaderboardScore > ,
  winningFollowerScores: Array < LeaderboardScore > ,
  losingLeaderScores: Array < LeaderboardScore > ,
  losingFollowerScores: Array < LeaderboardScore >
};

declare type LeaderboardScore = {
  id: string,
  attendanceId: number,
  position: number,
  score: number
};

// Express interface
declare interface ServerApiRequest {
  session: {
    user: ? User
  };
  body: mixed;
  query: {
    [name: string]: string
  };
  params: {
    [param: string]: string
  };
}

declare interface ServerApiResponse {
  status(statusCode: number): ServerApiResponse;
  sendStatus(statusCode: number): ServerApiResponse;
  json(body ? : mixed): ServerApiResponse;
}
