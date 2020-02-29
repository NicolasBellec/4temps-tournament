// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';
import type { AdminModel } from './data/admin';
import type { TournamentRepository } from './data/tournament';
import type { AccessKeyRepository } from './data/access-key';
import type { NoteRepository } from './data/note';

export const USER_ID = generateId();
export const TOURNAMENT_ID = generateId();

type Body = mixed;
type Query = {
  [name: string]: string
};
type Params = Query;

export class Request implements ServerApiRequest {
  body: Body = {};
  session: {
    user: ?{ id: string, role: PermissionRole }
  };
  query: Query = {};
  params: Params = {};

  constructor(admin: ?AdminModel) {
    this.session = {
      user: admin == null ? null : { id: admin._id.toString(), role: 'admin' }
    };
  }

  static empty() {
    // $FlowFixMe
    return new Request(null);
  }

  static withBody(body: Body) {
    return Request.withUserAndBody(createAdmin(), body);
  }

  static withUserAndBody(user: AdminModel, body: Body) {
    const req = new Request(user);
    req.body = body;
    return req;
  }

  static withQuery(query: Query) {
    return Request.withUserAndQuery(createAdmin(), query);
  }

  static withUserAndQuery(user: AdminModel, query: Query) {
    const req = new Request(user);
    req.query = query;
    return req;
  }

  static withParams(params: Params) {
    return Request.withUserAndParams(createAdmin(), params);
  }

  static withUserAndParams(user: AdminModel, params: Params) {
    const req = new Request(user);
    req.params = params;
    return req;
  }

  static withJudgeAndParams(judge: Judge, params: Params) {
    const req = new Request(null);
    req.session = { user: { id: judge.id, role: 'judge' } };
    req.params = params;
    return req;
  }
}

export class Response implements ServerApiResponse {
  _status: number;
  _body: ?mixed;

  getStatus() {
    return this._status;
  }

  getBody() {
    return this._body;
  }

  status(statusCode: number): ServerApiResponse {
    this._status = statusCode;
    return this;
  }

  sendStatus(statusCode: number): ServerApiResponse {
    this._status = statusCode;
    return this;
  }

  json(body?: mixed): ServerApiResponse {
    if (this._status == null) {
      this._status = 200;
    }
    this._body = body;
    return this;
  }
}

export class TournamentRepositoryImpl implements TournamentRepository {
  _tournaments: { [string]: Tournament } = {};

  get = async (id: string) => {
    return this._tournaments[id] || null;
  };

  getAll = async () => {
    return Object.keys(this._tournaments).map(key => this._tournaments[key]);
  };

  getForUser = async (userId: string) => {
    return (await this.getAll()).filter(
      ({ creatorId }) => creatorId === userId
    );
  };

  getForJudge = async (userId: string) => {
    const tournaments = await this.getAll();
    for (const tournament of tournaments) {
      if (tournament.judges.filter(judge => judge.id === userId).length > 0)
        return tournament;
    }
  };

  getForAssistant = async (userId: string) => {
    const tournaments = await this.getAll();
    for (const tournament of tournaments) {
      if (
        tournament.assistants.filter(assistant => assistant.id === userId)
          .length > 0
      ) {
        return tournament;
      }
    }
  };

  create = async (tournament: Tournament) => {
    this._tournaments[tournament.id] = tournament;
  };

  update = async (tournament: Tournament) => {
    this._tournaments[tournament.id] = tournament;
  };

  createParticipant = async (
    tournamentId: string,
    participant: Participant
  ) => {
    this._tournaments[tournamentId].participants.push(participant);
  };

  updateParticipantAttendance = async (
    participantId: string,
    isAttending: boolean
  ) => {
    for (const key in this._tournaments) {
      for (const participant of this._tournaments[key].participants) {
        if (participant.id === participantId) {
          participant.isAttending = isAttending;
          return participant;
        }
      }
    }
    return null;
  };

  createRound = async (tournamentId: string, round: Round) => {
    this._tournaments[tournamentId].rounds.push(round);
  };

  deleteRound = async (tournamentId: string, roundId: string) => {
    this._tournaments[tournamentId].rounds = this._tournaments[
      tournamentId
    ].rounds.filter(({ id }) => id !== roundId);
  };

  updateRound = async (tournamentId: string, round: Round) => {
    for (let i = 0; i < this._tournaments[tournamentId].rounds.length; ++i) {
      if (this._tournaments[tournamentId].rounds[i].id === round.id) {
        this._tournaments[tournamentId].rounds[i] = round;
      }
    }
  };

  addJudge = async (tournamentId: string, judge: Judge) => {
    this._tournaments[tournamentId].judges.push(judge);
  };

  markDanceAsNoted = async (
    tournamentId: string,
    judgeId: string,
    danceId: string
  ) => {
    this._tournaments[tournamentId].dancesNoted[judgeId] = [
      ...(this._tournaments[tournamentId].dancesNoted[judgeId] || []),
      danceId
    ];
  };

  addAssistant = async (tournamentId: string, assistant: Assistant) => {
    this._tournaments[tournamentId].assistants.push(assistant);
  };
}

export class AccessKeyRepositoryImpl implements AccessKeyRepository {
  _keys: Array<AccessKey> = [];

  getAll() {
    return this._keys;
  }

  async createForTournamentAndUserWithRole(
    tournamentId: string,
    userId: string,
    role: 'judge' | 'assistant'
  ) {
    this._keys.push({
      userId,
      tournamentId,
      key: String(
        Math.max(0, ...this._keys.map(({ key }) => parseInt(key))) + 1
      ),
      role
    });
  }

  async getForKey(key: string) {
    for (const k of this._keys) {
      if (k.key === key) {
        return k;
      }
    }
    return null;
  }

  async getForTournament(tournamentId: string) {
    return this._keys.filter(k => k.tournamentId === tournamentId);
  }
}

export class NoteRepositoryImpl implements NoteRepository {
  _notes: Array<JudgeNote> = [];

  getAll = () => this._notes;

  createOrUpdate = async (note: JudgeNote) => {
    const index = this._notes.findIndex(
      arrNote =>
        arrNote.judgeId === note.judgeId &&
        arrNote.participantId === note.judgeId &&
        arrNote.criterionId === note.criterionId &&
        arrNote.danceId === note.danceId
    );

    if (index != -1) {
      this._notes[index] = note;
    } else {
      this._notes.push(note);
    }
  };

  getForDance = async (danceId: string) => {
    return this._notes.filter(note => note.danceId === danceId);
  };

  delete = async (note: JudgeNote) => {
    this._notes = this._notes.filter(
      arrNote =>
        !(
          arrNote.judgeId === note.judgeId &&
          arrNote.participantId === note.judgeId &&
          arrNote.criterionId === note.criterionId &&
          arrNote.danceId === note.danceId
        )
    );
  };
}

export function createAdmin(): AdminModel {
  return {
    _id: USER_ID,
    email: 'test@gmail.com',
    firstName: 'john',
    lastName: 'smith',
    password: 'password'
  };
}

export function generateId() {
  return ObjectId.generate().toString();
}

export function createRound(): Round {
  return {
    id: generateId(),
    name: 'name',
    danceCount: 1,
    minPairCountPerGroup: 1,
    maxPairCountPerGroup: 2,
    passingCouplesCount: 5,
    tieRule: 'random',
    multipleDanceScoringRule: 'best',
    notationSystem: 'rpss',
    criteria: [
      {
        id: generateId(),
        name: 'style',
        minValue: 1,
        maxValue: 2,
        description: 'style...',
        type: 'one',
        forJudgeType: 'normal'
      }
    ],
    groups: [],
    active: false,
    finished: false,
    draw: false,
    errorOnSameScore: false,
    roundScores: [],
    winners: { leaders: [], followers: [] }
  };
}

export function createTournament(): Tournament {
  return {
    id: TOURNAMENT_ID,
    creatorId: USER_ID,
    name: 'name',
    date: moment(),
    type: 'jj',
    judges: [],
    assistants: [],
    participants: [],
    rounds: [],
    dancesNoted: {}
  };
}

export function createParticipant(): Participant {
  return {
    id: generateId(),
    name: 'John Smith',
    role: 'leaderAndFollower',
    isAttending: true,
    attendanceId: 1
  };
}

export function createJudge(): Judge {
  return {
    id: generateId(),
    name: 'Jane Smith',
    judgeType: 'normal'
  };
}

export function createAssistant(): Assistant {
  return {
    id: generateId(),
    name: 'Assistant Name'
  };
}

export function createCriterion(): RoundCriterion {
  return {
    id: generateId(),
    name: 'Style',
    minValue: 0,
    maxValue: 1,
    description: 'this is a criterion',
    type: 'both',
    forJudgeType: 'normal'
  };
}

export function createDance(): Dance {
  return {
    id: generateId(),
    active: false,
    finished: false
  };
}
