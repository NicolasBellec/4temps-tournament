// no-flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import ObjectId from 'bson-objectid';
import CreateTournament from './component';
import type { State as ComponentState } from './component';
import { createTournamentAction } from '../../action-creators';

type Props = {
  history: RouterHistory
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.createTournament;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: Props) {
  return {
    onSubmit: ({ name, date, type }: ComponentState) =>
      dispatch(createTournamentAction(name, date, type, history))
  };
}

const CreateTournamentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTournament);

export default CreateTournamentContainer;
