// @flow

import type { RouterHistory, Location } from 'react-router-dom';
import { loginAdmin, logoutAdmin, createAdmin } from '../../api/admin';
import { LOGIN_USER, LOGOUT_USER, SIGNUP } from '../../action-types';

export function getLoginUserAction(
  credentials: AdminCredentials,
  history: RouterHistory,
  referer: string,
): LoginAction {
  return {
    type: LOGIN_USER,
    promise: loginAdmin(credentials),
    meta: {
      onSuccess: () => history.push(referer),
    },
  };
}

export function getLogoutUserAction(history: RouterHistory): LogoutAction {
  return {
    type: LOGOUT_USER,
    promise: logoutAdmin(),
    meta: {
      onSuccess: () => history.push('/'),
    },
  };
}

export function getSignUpAction(
  admin: AdminWithPassword,
  history: RouterHistory,
  location: Location,
): SignUpAction {
  return {
    type: SIGNUP,
    promise: createAdmin(admin),
    meta: {
      onSuccess: () => history.push(`/login${location.search}`),
    },
  };
}
