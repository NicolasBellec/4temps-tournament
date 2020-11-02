// @flow

import type { RouterHistory } from 'react-router-dom';
import { loginAdmin, logoutAdmin } from '../../api/admin';
import { LOGIN_USER, LOGOUT_USER } from '../action-types';

export function getLoginUserAction(
  credential: AdminCredentials,
  history: RouterHistory,
  referer: string
): LoginUserAction {
  return {
    type: LOGIN_USER,
    promise: loginAdmin(credentials),
    meta: {
      onSuccess: () => history.push(referer),
    },
  };
}

export function getLogoutUserAction(history: RouterHistory) : LogoutUserAction {
  return {
    type: LOGOUT_USER,
    promise: logoutAdmin(),
    meta: {
      onSuccess: () => history.push('/'),
    },
  };
}
