// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Tournament, TournamentType } from '../models/tournament';

export type TournamentModel = {
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  date: Date,
  type: TournamentType
}

const schema = new mongoose.Schema({
  userId: {
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
});

const Model = mongoose.model('tournament', schema);

export const createTournament =
  async (userId: string, tournament: Tournament): Promise<?ObjectId> => {
    try {
      let { date, _id, ...rest } = tournament;
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        _id = new mongoose.Types.ObjectId();
      }
      const entry =
        await Model.create({ _id, userId, date: date.toDate(), ...rest });
      return entry._id;
    } catch (e) {
      return null;
    }
  };

export const updateTournament =
  async (tournamentId: string,
    tournament: Tournament): Promise<?TournamentModel> => {
    try {
      return Model.update({ _id: tournamentId }, {
        $set: {
          name:
            tournament.name,
          date: tournament.date.toDate(),
          type: tournament.type
        }
      });
    } catch (e) {
      return null;
    }
  };

export const getTournamentsForUser =
  async (userId: string): Promise<Array<TournamentModel>> => {
    try {
      return await Model.find({ userId });
    } catch (e) {
      return [];
    }
  };

export const getTournaments = async (): Promise<Array<TournamentModel>> => {
  try {
    return await Model.find();
  } catch (e) {
    return [];
  }
};

export const getTournament =
  async (tournamentId: string): Promise<?TournamentModel> => {
    try {
      return await Model.findOne({ _id: tournamentId });
    } catch (e) {
      return null;
    }
  };