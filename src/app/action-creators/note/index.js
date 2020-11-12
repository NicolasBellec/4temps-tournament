// @flow

import { SET_NOTE, GET_NOTES, SUBMIT_NOTES } from '../../action-types'
import { setTemporaryNote, getTemporaryNotesForDance, submitNotes } from '../../api/note'

export function getSetNoteAction(
  tournamentId: string,
  note: JudgeNote,
  participantId: string
): SetNoteAction {
  return {
    type: SET_NOTE,
    promise: setTemporaryNote(tournamentId, {
      ...note,
      participantId,
    }),
    payload: {
      ...note,
      participantId,
    },
  }
}

export function getGetNotesAction(tournamentId: string, danceId: string): GetNotesAction {
  return {
    type: GET_NOTES,
    promise: getTemporaryNotesForDance(tournamentId, danceId),
  }
}

export function getSubmitNotesAction(
  tournamentId: string,
  notes: Array<JudgeNote>
): SubmitNotesAction {
  return {
    type: SUBMIT_NOTES,
    promise: submitNotes(tournamentId, notes),
  }
}
