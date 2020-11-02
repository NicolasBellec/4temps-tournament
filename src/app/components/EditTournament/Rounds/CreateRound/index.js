// no-flow

import { connect } from 'react-redux';
import Component from './component';
import { getCreateRoundAction } from '../../../../action-creators/round';

type Props = {
  tournamentId: string,
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.createRound;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: (round: Round) =>
      dispatch(getCreateRoundAction(tournamentId, round)),
  };
}

const EditTournamentRoundsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default EditTournamentRoundsContainer;
