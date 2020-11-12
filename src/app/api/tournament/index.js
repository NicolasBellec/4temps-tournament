// @flow

import moment from 'moment';

import { apiGetRequest, apiPostRequest } from '../util';

import validateTournament from '../../../validators/validate-tournament';
import {
  normalizeTournamentArray,
  normalizeTournament,
} from '../../reducers/normalize';

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

type promisedArray = Promise<normalizedTournamentArray>;
type promisedTournament = Promise<normalizedTournament>;

export const deserializeTournament = (tour: Tournament): Tournament => {
  const { date, ...rest } = tour;
  return { date: moment(date), ...rest };
};

export async function getTournamentsForUser(): promisedArray {
  const tournaments: Tournament[] = await apiGetRequest(
    '/api/tournament/get',
    (tours) => tours.map(deserializeTournament),
  );
  return normalizeTournamentArray(tournaments);
}

export async function getTournament(id: string): promisedTournament {
  const tournament: Tournament = await apiGetRequest(
    `/api/tournament/get/${id}`,
  );
  return normalizeTournament(tournament);
}

export async function getTournamentForJudge(): promisedTournament {
  const tournament: Tournament = await apiGetRequest(
    '/api/tournament/get/judge',
  );
  return normalizeTournament(tournament);
}

export async function getAllTournaments(): promisedArray {
  const tournaments: Tournament[] = await apiGetRequest(
    '/api/tournament/get/all',
    (tours) => tours.map(deserializeTournament),
  );
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
