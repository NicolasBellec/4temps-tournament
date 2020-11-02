// @flow

import { createParticipant } from '../../api/participant';
import { CREATE_PARTICIPANT } from '../action-types';

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
