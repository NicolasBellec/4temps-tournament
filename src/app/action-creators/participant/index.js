// @flow

import { createParticipant, changeAttendance } from '../../api/participant';
import { CREATE_PARTICIPANT, CHANGE_ATTENDANCE, SELECT_PAIR } from '../action-types';

export function getCreateParticipantAction(
  tournamentId: string,
  name: string,
  role: ParticipantRole
) : CreateParticipantAction {
  return {
    type: CREATE_PARTICIPANT,
    promise: createParticipant(tournamentId, {
      id: '',
      name,
      role,
      attendanceId: 0, // generate on server side
      isAttending: false,
    }),
  };
}

export function getChangeAttendanceAction(
  tournamentId: string,
  id: string,
  isAttending: bool
) : ChangeAttendanceAction {
  return {
    type: CHANGE_ATTENDANCE,
    promise: changeAttendance(tournamentId, id, isAttending),
  };
}

export function getSelectPairAction(pair: string): SelectPairAction {
  return { type: SELECT_PAIR, payload: pair };
}
