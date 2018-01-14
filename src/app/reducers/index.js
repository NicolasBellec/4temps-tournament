// @flow
import { combineReducers } from 'redux';
import type { Reducer } from 'redux';
import { LIFECYCLE } from 'redux-pack';

import isAuthenticated from './is-authenticated';
import tournaments from './tournaments';
import participants from './participants';
import ui from './ui';

import makePackAction from './test-utils';

const reducer: Reducer<ReduxState, ReduxPackAction> =
  combineReducers({
    isAuthenticated,
    tournaments,
    participants,
    ui
  });

export function getInitialState(): ReduxState {
  return reducer(
    // $FlowFixMe
    undefined,
    makePackAction(LIFECYCLE.START, 'INVALID_ACTION'));
}

export default reducer;