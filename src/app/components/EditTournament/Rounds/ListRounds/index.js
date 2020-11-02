// no-flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import PreloadContainer from '../../../PreloadContainer';
import List from './component';
import { getAdminTournamentsAction, } from '../../../../action-creators/tournament';
import {
  getDeleteRoundAction,
  getStartRoundAction
} from '../../../../action-creators/round';

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
    load: () => dispatch(getAdminTournamentsAction()),
    deleteRound: (deleteId: string) =>
      dispatch(getDeleteRoundAction(tournamentId, deleteId)),
    startRound: (roundId: string) =>
      dispatch(getStartRoundAction(tournamentId, roundId, history)),
    onClick: (roundId: string) => history.push(`/tournament/${tournamentId}/round/${roundId}`),
  };
}

const ListRoundContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default ListRoundContainer;
