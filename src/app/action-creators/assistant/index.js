// @flow

import { CREATE_ASSISTANT } from '../action-types';
import { createAssistantApi } from '../../api/assistant';

export function createAssistantAction(
  tournamentId: string,
  name: string,
): CreateAssistantAction {
  return {
    type: CREATE_ASSISTANT,
    promise: createAssistantApi(tournamentId, { id: '', name }),
  };
}
