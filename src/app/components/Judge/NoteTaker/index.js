// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../PreloadContainer';
import Component from './component';
import { getGetNotesAction } from '../../../action-creators/note';

import type {
  Props,
  StateProps,
  OwnProps,
  DispatchProps
} from "./types"

function mapStateToProps({
  tournaments,
  rounds,
  notes,
}: ReduxState): StateProps {
  const tournament = tournaments.byId[tournaments.forJudge];
  return {
    shouldLoad: !(notes.isLoading || notes.didLoad),
    child: Component,
    isLastRound:
      rounds.byId[tournament.rounds[tournament.rounds.length - 1]].active,
    isClassic: tournament.type === 'classic',
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, danceId }: OwnProps,
): DispatchProps {
  return {
    load: () => {
      dispatch(getGetNotesAction(tournamentId, danceId))
    },
  };
}

const NoteTakerContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default NoteTakerContainer;
