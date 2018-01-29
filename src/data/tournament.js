// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import moment from 'moment';
import type { Tournament, TournamentType } from '../models/tournament';

type TournamentModel = {
  _id: ObjectId,
  creatorId: ObjectId,
  name: string,
  date: Date,
  type: TournamentType,
  judges: Array<string>
}

const schema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  judges: [String]
});

const Model = mongoose.model('tournament', schema);

export const getTournament =
  async (tournamentId: string): Promise<?Tournament> => {
    try {
      return mapToDomainModel(await Model.findOne({ _id: tournamentId }));
    } catch (e) {
      return null;
    }
  };

export interface TournamentRepository {
  create(tournament: Tournament): Promise<void>;
  get(id: string): Promise<?Tournament>;
  getAll(): Promise<Array<Tournament>>;
  getForUser(userId: string): Promise<Array<Tournament>>;
  update(tournament: Tournament): Promise<void>;
}

export class TournamentRepositoryImpl implements TournamentRepository {
  async create(tournament: Tournament) {
    await Model.create(mapToDbModel(tournament));
  }
  get(id: string) {
    return getTournament(id);
  }
  async getAll() {
    try {
      return await Model.find();
    } catch (e) {
      return [];
    }
  }
  async getForUser(userId: string) {
    try {
      return await Model.find({ creatorId: userId });
    } catch (e) {
      return [];
    }
  }
  async update(tournament: Tournament) {
    await Model.update({ _id: tournament._id }, {
      $set: mapToDbModel(tournament)
    });
  }
}

function mapToDbModel(tournament: Tournament): TournamentModel {
  const {_id, name, date, type, judges, creatorId} = tournament;
  return {
    name,
    type,
    judges,
    _id: new mongoose.Types.ObjectId(_id),
    creatorId: new mongoose.Types.ObjectId(creatorId),
    date: date.toDate(),
  };
}

function mapToDomainModel(tournament: TournamentModel): Tournament {
  const {_id, name, date, type, judges, creatorId} = tournament;
  return {
    _id: _id.toString(),
    name,
    type,
    judges,
    creatorId: creatorId.toString(),
    date: moment(date),
  };
}

export default TournamentRepositoryImpl;
