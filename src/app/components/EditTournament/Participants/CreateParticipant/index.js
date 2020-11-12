// @flow
import { connect } from 'react-redux';

import CreateParticipant from './component';
import { getCreateParticipantAction } from '../../../../action-creators/participant';

import type {
  OwnProps,
  StateProps,
  DispatchProps,
  Props,
  ComponentState,
} from './types';

function mapStateToProps(
  { tournaments, ui }: ReduxState,
  { tournamentId }: OwnProps,
): StateProps {
  return {
    ...ui.createParticipant,
    isClassic:
      tournaments.byId[tournamentId] != null
      && tournaments.byId[tournamentId].type === 'classic',
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: OwnProps,
): DispatchProps {
  return {
    onSubmit: ({ name, role }: ComponentState) => {
      dispatch(getCreateParticipantAction(tournamentId, name, role));
    },
  };
}

const CreateParticipantContainer = connect<
  Props,
  OwnProps,
  StateProps,
  _,
  _,
  _
>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateParticipant);

export default CreateParticipantContainer;
