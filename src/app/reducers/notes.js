// @flow
import { handle } from 'redux-pack';

export default function notesReducer(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction,
): NotesReduxState {
  switch (action.type) {
  case 'GET_NOTES':
    return getNotes(state, action);
  case 'SET_NOTE':
    return setNote(state, action);
  case 'LOGOUT_USER':
    return logout(state, action);
  }
  return state;
}

export function getInitialState(): NotesReduxState {
  return { isLoading: false, didLoad: false, byParticipant: {} };
}

function getNotes(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction,
): NotesReduxState {
  const { payload }: { payload: Array<JudgeNote> } = action;
  return handle(state, action, {
    start: (prevState) => ({
      ...prevState,
      isLoading: true,
    }),
    success: (prevState) => ({
      ...prevState,
      isLoading: false,
      didLoad: true,
      byParticipant: {
        ...payload.reduce((acc, note) => ({
          ...acc,
          [note.participantId]: {
            ...acc[note.participantId],
            [note.criterionId]: note,
          },
        }), {}),
      },
    }),
    failure: (prevState) => ({
      ...prevState,
      isLoading: false,
      didLoad: false,
    }),
  });
}

function setNote(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction,
): NotesReduxState {
  return handle(state, action, {
    start: (prevState) => updateNotesWithNote(prevState, action.payload),
    success: (prevState) => updateNotesWithNote(prevState, action.payload),
  });
}

function updateNotesWithNote(prevState: NotesReduxState, note: JudgeNote) {
  const newState = {
    ...prevState,
    byParticipant: {
      ...prevState.byParticipant,
      [note.participantId]: {
        ...prevState.byParticipant[note.participantId],
        [note.criterionId]: note,
      },
    },
  };

  if (note.value == null) {
    delete newState.byParticipant[note.participantId][note.criterionId];
  }

  return newState;
}

function logout(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction,
): NotesReduxState {
  return handle(state, action, {
    success: () => getInitialState(),
  });
}
