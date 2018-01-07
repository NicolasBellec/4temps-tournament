// @flow
import type Moment from 'moment';

export type TournamentType = 'none' | 'jj' | 'classic';

export type Tournament = {
  _id: string,
  name: string,
  date: Moment,
  type: TournamentType
}