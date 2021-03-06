// @flow

import { apiPostRequest } from '../util'
import validateJudge from '../../../validators/validate-judge'

export async function createJudge(tournamentId: string, judge: Judge): Promise<Response> {
  if (!validateJudge(judge)) {
    throw false
  }
  return apiPostRequest(`/api/judge/${tournamentId}/create`, judge)
}

export default createJudge
