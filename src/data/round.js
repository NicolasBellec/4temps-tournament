// @flow

import mongoose from 'mongoose'
import type { ObjectId } from 'mongoose'

type CriterionDbModel = {
  _id: ObjectId,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  forJudgeType: JudgeType,
}

export type RoundDbModel = {
  _id: ObjectId,
  name: string,
  danceCount: number,
  minPairCountPerGroup: number,
  maxPairCountPerGroup: number,
  passingCouplesCount: number,
  multipleDanceScoringRule: MultipleDanceScoringRule,
  notationSystem: NotationSystem,
  criteria: Array<CriterionDbModel>,
  active: boolean,
  finished: boolean,
  draw: boolean,
  groups: Array<DanceGroupDbModel>,
  errorOnSameScore: boolean,
  roundScores: Array<{ participantId: ObjectId, score: number }>,
  tieBreakerJudge: ?string,
  winners: {
    leaders: Array<{ score: number, participant: Participant }>,
    followers: Array<{ score: number, participant: Participant }>,
  },
}

type DanceGroupDbModel = {
  _id: ObjectId,
  pairs: Array<{ follower: ?ObjectId, leader: ?ObjectId }>,
  dances: Array<DanceDbModel>,
}

type DanceDbModel = {
  _id: ObjectId,
  active: boolean,
  finished: boolean,
}

const danceSchema = new mongoose.Schema({
  active: Boolean,
  finished: Boolean,
})

const groupSchema = new mongoose.Schema({
  pairs: [
    {
      follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
      leader: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
    },
  ],
  dances: [danceSchema],
})

export const schema: Mongoose$Schema<mixed> = new mongoose.Schema({
  name: { type: String, required: true },
  danceCount: {
    type: Number,
    required: true,
  },
  minPairCountPerGroup: {
    type: Number,
    required: true,
  },
  maxPairCountPerGroup: {
    type: Number,
    required: true,
  },
  passingCouplesCount: {
    type: Number,
    required: true,
  },
  multipleDanceScoringRule: {
    type: String,
    required: true,
  },
  errorOnSameScore: {
    type: Boolean,
    required: true,
  },
  notationSystem: {
    type: String,
    required: true,
  },
  criteria: [
    {
      name: { type: String, required: true },
      minValue: { type: Number, required: true },
      maxValue: { type: Number, required: true },
      description: { type: String, required: true },
      forJudgeType: { type: String, required: true },
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
  },
  draw: {
    type: Boolean,
    required: true,
  },
  groups: [groupSchema],
  roundScores: {
    type: [{ participantId: mongoose.Schema.Types.ObjectId, score: Number }],
  },
  tieBreakerJudge: {
    type: String,
    required: false,
  },
})

export function mapToDomainModel(round: RoundDbModel): Round {
  const { _id, groups, criteria, roundScores, ...same } = round

  return {
    ...same,
    id: _id.toString(),
    criteria: criteria.map(({ _id, ...sameCrit }) => ({
      ...sameCrit,
      id: _id.toString(),
    })),
    groups: groups.map((g) => ({
      id: g._id.toString(),
      pairs: g.pairs.map((p) => ({
        follower: p.follower == null ? null : p.follower.toString(),
        leader: p.leader == null ? null : p.leader.toString(),
      })),
      dances: g.dances.map((d) => ({
        id: d._id.toString(),
        active: d.active,
        finished: d.finished,
      })),
    })),
    roundScores: roundScores.map((entry) => ({
      participantId: entry.participantId.toString(),
      score: entry.score,
    })),
  }
}

export function mapToDbModel(round: Round): RoundDbModel {
  const { id, groups, criteria, roundScores, ...same } = round

  return {
    ...same,
    _id: new mongoose.Types.ObjectId(id),
    criteria: criteria.map(({ id, ...sameCrit }) => ({
      ...sameCrit,
      _id: new mongoose.Types.ObjectId(id),
    })),
    groups: groups.map((g) => ({
      _id: new mongoose.Types.ObjectId(g.id),
      pairs: g.pairs.map((p) => ({
        follower: p.follower == null ? null : new mongoose.Types.ObjectId(p.follower),
        leader: p.leader == null ? null : new mongoose.Types.ObjectId(p.leader),
      })),
      dances: g.dances.map((d) => ({
        _id: new mongoose.Types.ObjectId(d.id),
        active: d.active,
        finished: d.finished,
      })),
    })),
    roundScores: roundScores.map((entry) => ({
      participantId: new mongoose.Types.ObjectId(entry.participantId),
      score: entry.score,
    })),
  }
}
