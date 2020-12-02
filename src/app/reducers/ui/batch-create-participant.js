// @flow

import { handle } from 'redux-pack'

function participants(
  state: UiBatchCreateParticipantsReduxState = getInitialState(),
  action: ReduxPackAction
): UiBatchCreateParticipantsReduxState {
  const { type } = action

  switch (type) {
    case 'BATCH_CREATE_PARTICIPANT':
      return batchCreateParticipant(state, action)
    default:
      return state
  }
}

export function getInitialState(): UiBatchCreateParticipantsReduxState {
  return {
    isLoading: false,
    createdSuccessfully: false,
    error: '',
    validation: {
      isValid: true
    },
  }
}

function batchCreateParticipant(
  state: UiBatchCreateParticipantsReduxState,
  action: ReduxPackAction
): UiBatchCreateParticipantsReduxState {
  const { payload } = action

  return handle(state, action, {
    start: (prevState) => ({ ...prevState, isLoading: true }),
    success: () => ({
      ...getInitialState(),
      createdSuccessfully: true,
    }),
    failure: () => ({
      isLoading: false,
      createdSuccessfully: false,
      error: 'Invalid csv',
      validation: {
        isValid: false
      }
    }),
  })
}


export default participants
