// @flow

import {
  SET_NOTE,
  GET_NOTES
} from '../action-types';
import {
  setTemporaryNote,
  getTemporaryNotesForDance
} from '../../api/note';

export function getSetNoteAction(
  tournamentId: string,
  note: JudgeNote,
  participantId: string
): SetNoteAction {
  return {
    type: SET_NOTE,
    promise: setTemporaryNote(tournamentId, {
      ...note,
      participantId: participantId,
    }),
    payload: {
      ...note,
      participantId: participantId,
    },
  };
}

export function getGetNotesAction(
  tournamentId: string,
  danceId: string
): GetNotesAction {
  return {
    type: GET_NOTES,
    promise: getTemporaryNotesForDance(tournamentId, danceId),
  };
}
