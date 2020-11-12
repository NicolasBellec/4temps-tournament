// @flow

import moment from 'moment';

import { apiGetRequest, apiPostRequest } from '../util';

import validateTournament from '../../../validators/validate-tournament';
import {
  normalizeTournamentArray,
  normalizeTournament,
} from '../../reducers/normalize';


type normalizedTourArray = $Call<typeof normalizeTournamentArray, Tournament[]>;
type normalizedTour = $Call<typeof normalizeTournament, Tournament>;

export const createTournamentApi = async (
  tournament: Tournament,
): Promise<Tournament> => {
  const validation = validateTournament(tournament);
  if (!validation.isValidTournament) {
    throw validation;
  }

  return apiPostRequest(
    '/api/tournament/create',
    tournament,
    deserializeTournament,
  );
};

export const deserializeTournament = (tour: Tournament): Tournament => {
  const { date, ...rest } = tour;
  return { date: moment(date), ...rest };
};

export async function getTournamentsForUser(): Promise<normalizedTourArray> {
  const tournaments: Tournament[] = await apiGetRequest(
    '/api/tournament/get',
    (tours) => tours.map(deserializeTournament));
  return normalizeTournamentArray(tournaments);
}

export async function getTournament(id: string): Promise<normalizedTour> {
  const tournament: Tournament = await apiGetRequest(`/api/tournament/get/${id}`);
  return normalizeTournament(tournament);
}


export async function getTournamentForJudge(): Promise<normalizedTour> {
  const tournament: Tournament = await apiGetRequest('/api/tournament/get/judge');
  return normalizeTournament(tournament);
}

export async function getAllTournaments(): Promise<normalizedTourArray>{
  const tournaments: Tournament[] = await apiGetRequest(
    '/api/tournament/get/all',
    (tours) => tours.map(deserializeTournament));
  return normalizeTournamentArray(tournaments);
}

export const updateTournament = async (
  tournamentId: string,
  tournament: Tournament,
): Promise<Tournament> => {
  const validation = validateTournament(tournament);
  if (!validation.isValidTournament) {
    throw validation;
  }

  return apiPostRequest(
    `/api/tournament/update/${tournamentId}`,
    { tournamentId, tournament },
    deserializeTournament,
  );
};
