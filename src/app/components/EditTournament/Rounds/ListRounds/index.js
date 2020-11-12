// @flow

import { connect } from 'react-redux'
import PreloadContainer from '../../../../containers/PreloadContainer'
import List from './component'
import { getAdminTournamentsAction } from '../../../../action-creators/tournament'
import { getDeleteRoundAction, getStartRoundAction } from '../../../../action-creators/round'

import type { OwnProps, StateProps, DispatchProps, Props } from './types'

function mapStateToProps({ rounds }: ReduxState, { tournamentId }: OwnProps): StateProps {
  const tournamentRounds = (rounds.forTournament[tournamentId] || []).map((id) => rounds.byId[id])

  const nextRound = tournamentRounds.find(({ finished }) => !finished)

  return {
    tournamentId,
    child: List,
    shouldLoad: !rounds.forTournament[tournamentId],
    rounds: tournamentRounds,
    nextRound: nextRound ? nextRound.id : null,
  }
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, history }: OwnProps
): DispatchProps {
  return {
    load: () => {
      dispatch(getAdminTournamentsAction())
    },
    deleteRound: (id: string) => {
      dispatch(getDeleteRoundAction(tournamentId, id))
    },
    startRound: (id: string) => {
      dispatch(getStartRoundAction(tournamentId, id, history))
    },
    onClick: (id: string) => history.push(`/tournament/${tournamentId}/round/${id}`),
  }
}

const ListRoundContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer)

export default ListRoundContainer
