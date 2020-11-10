// no-flow

import { connect } from 'react-redux';
import { getSingleTournamentAction } from '../../../action-creators/tournament';
import type {
  OwnProps,
  StateProps,
  DispatchProps,
} from '../types';
import PreloadContainer from '../../PreloadContainer';
import TabContent from './component';

function mapStateToProps(
  { tournaments }: ReduxState,
  ownProps: OwnProps,
): StateProps {
  return {
    child: TabContent,
    shouldLoad: tournaments.byId[ownProps.tournamentId] === undefined,
    ...ownProps,
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: OwnProps,
): DispatchProps {
  return {
    load: () => dispatch(getSingleTournamentAction(tournamentId)),
  };
}

const TabContentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default TabContentContainer;
