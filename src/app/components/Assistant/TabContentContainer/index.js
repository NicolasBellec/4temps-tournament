// @flow

import { connect } from 'react-redux';
// $FlowFixMe
import { getSingleTournamentAction } from '../../../action-creators/tournament';
import type {
  OwnProps,
  StateProps,
  DispatchProps,
  Props
} from './types';
import PreloadContainer from '../../PreloadContainer';
import TabContent from './component';

function mapStateToProps(
  { tournaments }: ReduxState,
  { tournamentId }: OwnProps
): StateProps {
  return {
    child: TabContent,
    shouldLoad: tournaments.byId[tournamentId] === undefined,
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: OwnProps,
): DispatchProps {
  return {
    load: () => {
      dispatch(getSingleTournamentAction(tournamentId))
    },
  };
}

const TabContentContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default TabContentContainer;
