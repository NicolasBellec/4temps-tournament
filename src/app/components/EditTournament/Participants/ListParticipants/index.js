// @flow
import { connect } from 'react-redux'

import ListParticipants from './component'
import PreloadContainer from '../../../../containers/PreloadContainer'
import {
  getAdminTournamentsAction,
  getSingleTournamentAction,
} from '../../../../action-creators/tournament'
import { getChangeAttendanceAction } from '../../../../action-creators/participant'

import type { OwnProps, StateProps, DispatchProps, Props } from './types'

function mapStateToProps(
  { user, tournaments, participants }: ReduxState,
  { tournamentId }: OwnProps
): StateProps {
  const shouldLoad = !participants.forTournament[tournamentId]
  return {
    Child: ListParticipants,
    shouldLoad,
    participants: (participants.forTournament[tournamentId] || []).map(
      (id) => participants.byId[id]
    ),
    isClassic: !shouldLoad && tournaments.byId[tournamentId].type === 'classic',
    loadArgs: user.role !== 'admin' ? user.tournamentId : null,
  }
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: OwnProps): DispatchProps {
  return {
    load: (args = null) => {
      if (args !== null && args !== undefined) {
        dispatch(getSingleTournamentAction(args))
      } else {
        dispatch(getAdminTournamentsAction())
      }
    },
    onChangeAttending: (id, isAttending) => {
      dispatch(getChangeAttendanceAction(tournamentId, id, isAttending))
    },
  }
}

const ListParticipantsContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer)

export default ListParticipantsContainer
