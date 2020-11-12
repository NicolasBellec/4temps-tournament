// @flow

import { connect } from 'react-redux'
import type { StateProps, Props, OwnProps } from './types'
import Component from './component'

function mapStateToProps({ rounds, participants }: ReduxState, { roundId }: OwnProps): StateProps {
  const round = rounds.byId[roundId]
  const roundScores = hydrateScores(round.roundScores, participants)

  const pairs = getPairs(round)

  const leaders = new Set(getLeaders(pairs))
  const followers = new Set(getFollowers(pairs))

  const leaderScores = roundScores
    .filter(({ participant }) => leaders.has(participant.id))
    .map((score, i) => ({ ...score, position: i + 1 }))

  const followerScores = roundScores
    .filter(({ participant }) => followers.has(participant.id))
    .map((score, i) => ({ ...score, position: i + 1 }))

  return {
    isFinished: round.finished,
    winningLeaderScores: leaderScores.slice(0, round.passingCouplesCount),
    winningFollowerScores: followerScores.slice(0, round.passingCouplesCount),
    losingLeaderScores: leaderScores.slice(round.passingCouplesCount),
    losingFollowerScores: followerScores.slice(round.passingCouplesCount),
  }
}

function hydrateScores(roundScores: Array<Score>, participants: ParticipantsReduxState) {
  return roundScores.map((score) => ({
    score: score.score,
    participant: participants.byId[score.participantId],
  }))
}

function getPairs(round: Round): Array<Pair> {
  return round.groups.reduce((pairs, group) => [...pairs, ...group.pairs], [])
}

function getLeaders(pairs: Array<Pair>): Array<string> {
  return pairs.reduce((acc, pair) => (pair.leader != null ? [...acc, pair.leader] : acc), [])
}

function getFollowers(pairs: Array<Pair>): Array<string> {
  return pairs.reduce((acc, pair) => (pair.follower != null ? [...acc, pair.follower] : acc), [])
}

const connector = connect<Props, OwnProps, StateProps, _, _, _>(mapStateToProps)

const ScoreViewContainer = connector(Component)

export default ScoreViewContainer
