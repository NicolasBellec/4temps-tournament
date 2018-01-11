// @flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';

import PreloadContainer from '../PreloadContainer';
import TournamentList from '../TournamentList';
import { getTournamentsForUser } from '../../api/tournament';

function mapStateToProps({ tournaments }: ReduxState) {
  return {
    shouldLoad: !tournaments.didLoadUserTournaments,
    isLoading: tournaments.isLoading,
    Child: TournamentList,
    tournaments: tournaments.forUser.map(id => tournaments.byId[id])
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { history }: { history: RouterHistory }) {
  return {
    load: () => dispatch({
      type: 'GET_USER_TOURNAMENTS',
      promise: getTournamentsForUser()
    }),
    onClick: (id: string) => history.push(`/tournament/edit/${id}`)
  };
}

const EditTournamentListContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default EditTournamentListContainer;