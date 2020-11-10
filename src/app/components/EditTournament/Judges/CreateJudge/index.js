// no-flow

import { connect } from 'react-redux';
import Component from './component';
import getCreateJudgeAction from '../../../../action-creators/judge';

type Props = {
  tournamentId: string,
};

function mapStateToProps({ ui }: ReduxState): UiCreateJudgeReduxState {
  return ui.createJudge;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: ({ name, judgeType }: { name: string, judgeType: JudgeType }) => {
      dispatch(getCreateJudgeAction(tournamentId, name, judgeType));
    },
  };
}

const connector = connect<_, Props, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
);
const CreateJudgeContainer = connector(Component);

export default CreateJudgeContainer;
