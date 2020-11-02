// @flow
import { getAccessKeysForTournament } from '../../api/access-key';
import { GET_ACCESS_KEYS } from '../action-types';

export function getAccessKeysAction(tournamentId: string): GetAccessKeysAction {
  return {
    type: GET_ACCESS_KEYS,
    promise: getAccessKeysForTournament(tournamentId),
  };
}
