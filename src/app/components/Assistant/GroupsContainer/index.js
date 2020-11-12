// @flow

import { connect } from 'react-redux'
import type { StateProps, OwnProps, Props } from './types'

import Groups from './component'

function mapStateToProps(
  { tournaments, rounds, participants }: ReduxState,
  { tournamentId }: OwnProps
): StateProps {
  const tournament = tournaments.byId[tournamentId]
  const round = tournament.rounds.map((id) => rounds.byId[id]).filter((r) => r.active)[0]

  if (!round) {
    return {
      hasActiveRound: false,
      roundName: '',
      groups: [],
    }
  }

  const roundName = `Round ${tournament.rounds.findIndex((id) => id === round.id) + 1}`
  const groups = round.groups.map((group, i) => ({
    number: i + 1,
    pairs: group.pairs.map(({ leader, follower }) => {
      if (leader == null || follower == null) {
        return '?'
      }

      if (tournament.type === 'classic') {
        return String(participants.byId[leader].attendanceId)
      }

      return `L${participants.byId[leader].attendanceId} - F${participants.byId[follower].attendanceId}`
    }),
  }))

  return { hasActiveRound: true, roundName, groups }
}

const GroupsContainer = connect<Props, OwnProps, StateProps, _, _, _>(mapStateToProps)(Groups)

export default GroupsContainer
