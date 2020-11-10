// @flow

import { connect } from 'react-redux';
import ObjectId from 'bson-objectid';
import CreateTournament from './component';
// $FlowFixMe
import { getCreateTournamentAction } from '../../action-creators/tournament';

import type {
  OwnProps,
  StateProps,
  DispatchProps,
  ComponentState,
  Props
} from './types';

function mapStateToProps({ ui }: ReduxState): StateProps {
  return ui.createTournament;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history }: OwnProps
) : DispatchProps {
  return {
    onSubmit: ({ name, date, type }: ComponentState) => { dispatch(getCreateTournamentAction(name, date, type, history)) },
  };
}

const CreateTournamentContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTournament);

export default CreateTournamentContainer;
