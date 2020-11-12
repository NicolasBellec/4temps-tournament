// @flow

import { connect } from 'react-redux';
import Component from './component';
import getCreateJudgeAction from '../../../../action-creators/judge';

import type { OwnProps, DispatchProps, Props } from './types';

function mapStateToProps({ ui }: ReduxState): UiCreateJudgeReduxState {
  return ui.createJudge;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: OwnProps,
): DispatchProps {
  return {
    onSubmit: ({ name, judgeType }) => {
      dispatch(getCreateJudgeAction(tournamentId, name, judgeType));
    },
  };
}

const connector = connect<Props, OwnProps, UiCreateJudgeReduxState, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
);
const CreateJudgeContainer = connector(Component);

export default CreateJudgeContainer;
