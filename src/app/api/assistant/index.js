// @flow

import { apiPostRequest } from '../util';
import validateAssistant from '../../../validators/validate-assistant';

export async function createAssistantApi(
  tournamentId: string,
  assistant: Assistant,
): Promise<Response> {
  if (!validateAssistant(assistant)) {
    throw false;
  }
  return apiPostRequest(`/api/assistant/${tournamentId}/create`, assistant);
}

export default createAssistantApi;
