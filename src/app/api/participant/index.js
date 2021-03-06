// @flow

import { apiPostRequest } from '../util'

import { validateParticipant } from '../../../validators/validate-participant'

export const createParticipant = async (
  tournamentId: string,
  participant: Participant
): Promise<{
  tournamentId: string,
  participant: Participant,
}> => {
  const validation = validateParticipant(participant)
  if (!validation.isValidParticipant) {
    throw validation
  }

  return apiPostRequest(`/api/participant/${tournamentId}/create`, {
    tournamentId,
    participant,
  })
}

export const batchCreateParticipant = async (
  tournamentId: string,
  participants: string
): Promise<{
  tournamentId: string,
  participants: Participant[]
}> => {
  return apiPostRequest(`/api/participant/${tournamentId}/batch-create`, {
    tournamentId,
    participants,
  })
}


export async function changeAttendance(
  tournamentId: string,
  participantId: string,
  isAttending: boolean
): Promise<Response> {
  return apiPostRequest(`/api/participant/${tournamentId}/attendance`, {
    participantId,
    isAttending,
  })
}

export default createParticipant
