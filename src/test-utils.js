// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';
import type {
  UserModel
} from './data/user';
import type {
  TournamentRepository
} from './data/tournament';
import type {
  AccessKeyRepository
} from './data/access-key';
import type {
  Tournament
} from './models/tournament';

export const USER_ID = generateId();
export const TOURNAMENT_ID = generateId();

type Body = {
    [name: string]: mixed
};
type Query = {
    [name: string]: string
};
type Params = Query;

export class Request implements ServerApiRequest {
  body: Body = {};
  session: {
    user: UserModel
  };
  query: Query = {};
  params: Params = {};

  constructor(user: UserModel) {
    this.session = {
      user
    };
  }

  static empty() {
    // $FlowFixMe
    return new Request(null);
  }

  static withBody(body: Body) {
    return Request.withUserAndBody(createUser(), body);
  }

  static withUserAndBody(user: UserModel, body: Body) {
    const req = new Request(user);
    req.body = body;
    return req;
  }

  static withQuery(query: Query) {
    return Request.withUserAndQuery(createUser(), query);
  }

  static withUserAndQuery(user: UserModel, query: Query) {
    const req = new Request(user);
    req.query = query;
    return req;
  }

  static withParams(params: Params) {
    return Request.withUserAndParams(createUser(), params);
  }

  static withUserAndParams(user: UserModel, params: Params) {
    const req = new Request(user);
    req.params = params;
    return req;
  }
}

export class Response implements ServerApiResponse {
  _status: number;
  _body: ? mixed;

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

  json(body ?: mixed): ServerApiResponse {
    this._status = 200;
    this._body = body;
    return this;
  }
}

export class TournamentRepositoryImpl implements TournamentRepository {
  _tournaments: {[string]: Tournament} = {};

  get = async (id: string) => {
    return this._tournaments[id] || null;
  }

  getAll = async () => {
    return Object.keys(this._tournaments).map(key => this._tournaments[key]);
  }

  getForUser = async (userId: string) => {
    return (await this.getAll()).filter(({creatorId}) => creatorId === userId);
  }

  create = async (tournament: Tournament) => {
    this._tournaments[tournament.id] = tournament;
  }

  update = async (tournament: Tournament) => {
    this._tournaments[tournament.id] = tournament;
  }

  createParticipant =
    async (tournamentId: string, participant: Participant) => {
      this._tournaments[tournamentId].participants.push(participant);
    }

  createRound =
    async (tournamentId: string, round: Round) => {
      this._tournaments[tournamentId].rounds.push(round);
    }

  deleteRound =
    async (tournamentId: string, roundId: string) => {
      this._tournaments[tournamentId].rounds =
        this._tournaments[tournamentId].rounds
          .filter(({id}) => id !== roundId);
    }

  updateRound =
    async (tournamentId: string, round: Round) => {
      for (let i = 0; i < this._tournaments[tournamentId].rounds.length; ++i) {
        if (this._tournaments[tournamentId].rounds[i].id === round.id) {
          this._tournaments[tournamentId].rounds[i] = round;
        }
      }
    }

  addJudge =
    async (tournamentId: string, judge: Judge) => {
      this._tournaments[tournamentId].judges.push(judge);
    }
}

export class AccessKeyRepositoryImpl implements AccessKeyRepository {
  _keys: Array<AccessKey> = [];

  getAll() {
    return this._keys;
  }

  async createForTournamentAndUser(tournamentId: string, userId: string) {
    this._keys.push({
      userId,
      tournamentId,
      key: String(
        Math.max(0, ...(this._keys.map(({key}) => parseInt(key)))) + 1)
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
}

export function createUser(): UserModel {
  return {
    _id: USER_ID,
    email: 'test@gmail.com',
    firstName: 'john',
    lastName: 'smith',
    password: 'password',
  };
}

export function generateId() {
  return ObjectId.generate().toString();
}

export function createRound(): Round {
  return {
    id: '',
    name: 'name',
    danceCount: 1,
    minPairCount: 1,
    maxPairCount: 2,
    tieRule: 'random',
    roundScoringRule: 'average',
    multipleDanceScoringRule: 'worst',
    criteria: [{
      name: 'style',
      minValue: 1,
      maxValue: 2,
      description: 'style...',
      type: 'one'
    }],
    groups: [],
    active: false,
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
    participants: [],
    rounds: []
  };
}

export function createParticipant(): Participant {
  return {
    id: generateId(),
    name: 'John Smith',
    role: 'both'
  };
}

export function createJudge(): Judge {
  return {
    id: generateId(),
    name: 'Jane Smith'
  };
}