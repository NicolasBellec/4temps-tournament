// @flow

import { connect } from 'react-redux';
import Component from './component';
import { getCreateRoundAction } from '../../../../action-creators/round';

import type {
  OwnProps,
  StateProps,
  DispatchProps,
  Props,
  RoundViewModel
} from "./types";

function mapStateToProps({ ui }: ReduxState): StateProps {
  return ui.createRound;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: OwnProps
): DispatchProps {
  return {
    onSubmit: (round: Round) => {
      dispatch(getCreateRoundAction(tournamentId, round))
    },
  };
}

const EditTournamentRoundsContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default EditTournamentRoundsContainer;
