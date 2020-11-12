// @flow

import { connect } from 'react-redux';

import PreloadContainer from '../PreloadContainer';
import TournamentList from '../TournamentList';
import { getAdminTournamentsAction } from '../../action-creators/tournament';

import type {
  Props,
  StateProps,
  DispatchProps,
  OwnProps
} from "./types";

function mapStateToProps(
  { tournaments }: ReduxState,
  { history }: OwnProps,
): StateProps {
  if (
    tournaments.didLoadAdminTournaments
    && tournaments.forAdmin.length === 0
  ) {
    // If we loaded all tournaments and list was empty redirect to create
    history.push('/tournament/create');
  }
  return {
    shouldLoad: !tournaments.didLoadAdminTournaments,
    isLoading: tournaments.isLoading,
    child: TournamentList,
    tournaments: tournaments.forAdmin.map((id) => tournaments.byId[id]),
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history }: OwnProps,
): DispatchProps {
  return {
    load: () => {
      dispatch(getAdminTournamentsAction())
    },
    onClick: (id: string) => history.push(`/tournament/edit/${id}`),
  };
}

const EditTournamentListContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default EditTournamentListContainer;
