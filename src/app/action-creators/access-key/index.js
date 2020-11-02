// @flow
import {
  getAccessKeysForTournament,
  loginWithAccessKey
} from '../../api/access-key';
import { GET_ACCESS_KEYS, LOGIN_WITH_ACCESS_KEY } from '../action-types';

export function getAccessKeysAction(tournamentId: string): GetAccessKeysAction {
  return {
    type: GET_ACCESS_KEYS,
    promise: getAccessKeysForTournament(tournamentId),
  };
}

export function getLoginWithAccessKey(accessKey: string): getLoginWithAccessKey {
  return {
    type: LOGIN_WITH_ACCESS_KEY,
    promise: loginWithAccessKey(accessKey),
    meta: {
      onSuccess: () => history.push('/'),
    },
  };
}
