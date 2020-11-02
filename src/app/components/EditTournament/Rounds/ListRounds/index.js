// no-flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import PreloadContainer from '../../../PreloadContainer';
import List from './component';
import { deleteRound, startRound } from '../../../../api/round';
import { getAdminTournamentsAction } from '../../../../action-creators/tournament';

type Props = {
  tournamentId: string,
  history: RouterHistory,
};

function mapStateToProps({ rounds }: ReduxState, { tournamentId }: Props) {
  const tournamentRounds = (rounds.forTournament[tournamentId] || []).map(
    (id) => rounds.byId[id],
  );

  const nextRound = tournamentRounds.find(({ finished }) => !finished);

  return {
    tournamentId,
    Child: List,
    shouldLoad: !rounds.forTournament[tournamentId],
    rounds: tournamentRounds,
    nextRound: nextRound ? nextRound.id : null,
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, history }: Props,
) {
  return {
    deleteRound: (deleteId: string) => dispatch({
    load: () => dispatch(getAdminTournamentsAction()),
      type: 'DELETE_ROUND',
      promise: deleteRound(tournamentId, deleteId),
    }),
    startRound: (roundId: string) => dispatch({
      type: 'START_ROUND',
      promise: startRound(tournamentId, roundId),
      meta: {
        onSuccess: () => history.push(`/tournament/${tournamentId}/round/${roundId}`),
      },
    }),
    onClick: (roundId: string) => history.push(`/tournament/${tournamentId}/round/${roundId}`),
  };
}

const ListRoundContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default ListRoundContainer;
