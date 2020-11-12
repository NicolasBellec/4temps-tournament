// @flow

import { connect } from 'react-redux';

import PreloadContainer from '../../containers/PreloadContainer';
import Component from './component';
import { getAdminTournamentsAction } from '../../action-creators/tournament';

import type {
  Props,
  OwnProps,
  StateProps,
  DispatchProps
} from "./types";

function mapStateToProps(state: ReduxState, { match }: OwnProps): StateProps {
  const roundId = match.params.roundId || '';
  const tournamentId = match.params.tournamentId || '';
  return {
    shouldLoad: !state.rounds.byId[roundId],
    child: Component,
    roundId,
    tournamentId,
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    load: () => dispatch(getAdminTournamentsAction()),
  };
}

const RoundOverviewContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default RoundOverviewContainer;
