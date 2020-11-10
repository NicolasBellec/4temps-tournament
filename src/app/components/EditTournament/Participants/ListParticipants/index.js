// no-flow
import { connect } from 'react-redux';

import ListParticipants from './component';
import PreloadContainer from '../../../PreloadContainer';
import {
  getAdminTournamentsAction,
  getSingleTournamentAction,
} from '../../../../action-creators/tournament';
import { getChangeAttendanceAction } from '../../../../action-creators/participant';

type Props = {
  tournamentId: string,
};

function mapStateToProps(
  { user, tournaments, participants }: ReduxState,
  { tournamentId }: Props,
) {
  const shouldLoad = !participants.forTournament[tournamentId];
  return {
    child: ListParticipants,
    shouldLoad,
    participants: (participants.forTournament[tournamentId] || []).map(
      (id) => participants.byId[id],
    ),
    isClassic: !shouldLoad && tournaments.byId[tournamentId].type === 'classic',
    loadArgs: user.role !== 'admin' ? user.tournamentId : null,
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: (tournamentId) => {
      if (tournamentId) {
        dispatch(getSingleTournamentAction(tournamentId));
      } else {
        dispatch(getAdminTournamentsAction());
      }
    },
    onChangeAttending: (id, isAttending) => dispatch(getChangeAttendanceAction(tournamentId, id, isAttending)),
  };
}

const ListParticipantsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default ListParticipantsContainer;
