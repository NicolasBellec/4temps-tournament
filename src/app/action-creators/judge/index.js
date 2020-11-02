// @flow

import { createJudge } from '../../api/judge';
import { CREATE_JUDGE } from '../action-types';

export function getCreateJudgeAction(
  tournamentId: string,
  name: string,
  judgeType: JudgeType,
): CreateJudgeAction {
  return {
    type: CREATE_JUDGE,
    promise: createJudge(tournamentId, { id: '', name, judgeType }),
  };
}
