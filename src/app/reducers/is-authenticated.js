// @flow

import { handle } from 'redux-pack';

function isAuthenticated(state: boolean = false, action: mixed) {
  if (action != null) {
    // $FlowFixMe
    const { type } = action;

    switch (type) {
    case 'LOGIN_USER':
      return handle(state, action, {
        success: () => true,
        failure: () => false
      });
    case 'LOGOUT_USER':
      return handle(state, action, {
        success: () => false
      });
    }
  }
  return state;
}

export default isAuthenticated;