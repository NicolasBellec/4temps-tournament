// no-flow

import { connect } from 'react-redux';
import Component from './component';
import { getCreateJudgeAction } from '../../../../action-creators/judge';

type Props = {
  tournamentId: string,
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.createJudge;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: ({ name, judgeType }: { name: string, judgeType: JudgeType }) =>
      dispatch(getCreateJudgeAction(tournamentId, name, judgeType))
  };
}

const CreateJudgeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default CreateJudgeContainer;
