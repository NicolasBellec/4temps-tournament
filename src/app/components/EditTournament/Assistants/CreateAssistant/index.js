// no-flow

import { connect } from 'react-redux';
import Component from './component';
import { createAssistantAction } from '../../../../action-creators/assistant';

type Props = {
  tournamentId: string,
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.createAssistant;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: (name: string) => dispatch(createAssistantAction(tournamentId, name)),
  };
}

const CreateAssistantContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default CreateAssistantContainer;
