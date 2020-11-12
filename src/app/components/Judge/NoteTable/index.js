// @flow

import { connect } from 'react-redux'
import DanceScorer from '../../../../domain/dance-scorer'
import Component from './component'

import type { Props, OwnProps, StateProps, ColumnViewModel, ScoreViewModel } from './types'

function mapStateToProps(state: ReduxState): StateProps {
  const tournament = getTournament(state)
  const activeRound = getActiveRound(state)

  const danceId = getActiveDanceId(activeRound)
  const notes = getNotesForActiveDance(state, danceId)

  const danceScores = new DanceScorer(tournament.judges, activeRound.criteria, notes, {
    allowNegative: true,
    countPresident: true,
  }).scoreDance(danceId)

  return {
    columns: divideScoreIntoColumns(state, danceScores),
    tournamentId: state.tournaments.forJudge,
  }
}

function getTournament(state: ReduxState): Tournament {
  const tournament = state.tournaments.byId[state.tournaments.forJudge]
  return {
    ...tournament,
    rounds: tournament.rounds.map((id) => state.rounds.byId[id]),
    judges: tournament.judges.map((id) => state.judges.byId[id]),
    assistants: tournament.assistants.map((id) => state.assistants.byId[id]),
    participants: tournament.participants.map((id) => state.participants.byId[id]),
  }
}

function getNotesForActiveDance(state: ReduxState, activeDanceId: string): Array<JudgeNote> {
  return Object.keys(state.notes.byParticipant)
    .reduce(
      (notes, participantId) => [
        ...notes,
        ...Object.keys(state.notes.byParticipant[participantId]).reduce(
          (acc, critId) => [...acc, state.notes.byParticipant[participantId][critId]],
          []
        ),
      ],
      []
    )
    .filter(({ danceId }) => danceId === activeDanceId)
}

function getActiveDanceId(round: Round): string {
  return round.groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active)
    if (dance) {
      return dance.id
    }
    return res
  }, '')
}

function getActiveRound(state: ReduxState): Round {
  const tournament = state.tournaments.byId[state.tournaments.forJudge]
  const rounds = tournament.rounds.map((id) => state.rounds.byId[id])
  return rounds.filter((round) => round.active)[0];
}

function divideScoreIntoColumns(
  state: ReduxState,
  danceScores: Array<Score>
): Array<ColumnViewModel> {
  const scoreMap = danceScores.reduce(
    (acc, score) => ({
      ...acc,
      [score.participantId]: score,
    }),
    {}
  );
  // TODO: Must change here to modify the last round classic behavior
  if (isLastRound(state) || isClassicTournament(state)) {
    return [getPairColumn(state, scoreMap, getPairs(state))]
  }
  return getSeparateColumns(state, scoreMap, getPairs(state))
}

function isClassicTournament(state: ReduxState) {
  const tournament = state.tournaments.byId[state.tournaments.forJudge]
  return tournament.type === 'classic'
}

function isLastRound(state: ReduxState) {
  const tournament = state.tournaments.byId[state.tournaments.forJudge]
  const activeRound = getActiveRound(state)
  return activeRound.id === tournament.rounds[tournament.rounds.length - 1]
}

function getPairs(state: ReduxState): Array<Pair> {
  return getActiveRound(state).groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active)
    if (dance) {
      return group.pairs
    }
    return res
  }, [])
}

function getPairColumn(
  state: ReduxState,
  danceScores: { [id: string]: Array<Score> },
  pairs: Array<Pair>
): ColumnViewModel {
  const scoreViewModels: ScoreViewModel[] = pairs
    .map((pair) => {
      const name = getPairName(state, pair);
      if ( typeof pair.leader === "string" && danceScores[pair.leader] != null ) {
        return {
          name: name,
          value: danceScores[pair.leader][0].score, // Strange modification
        };
      } else {
        return {
          name: name,
          value: 0
        };
      }
    })
    .sort((a, b) => b.value - a.value)
  return { title: 'Couples', danceScores: scoreViewModels }
}

function getPairName(state: ReduxState, { leader, follower }: Pair): string {
  if ( typeof leader === "string" ) {
    if (isClassicTournament(state)) {
      return state.participants.byId[leader].attendanceId.toString()
    }
    if ( typeof follower === "string" ) {
      return `L${state.participants.byId[leader].attendanceId} - F${state.participants.byId[follower].attendanceId}`
    } else {
      return ""
    }
  } else {
    return ""
  }
}

function getSeparateColumns(
  state: ReduxState,
  danceScores: { [id: string]: Array<Score> },
  pairs: Array<Pair>
): Array<ColumnViewModel> {
  const leaderViewModels = pairs
    .map(({ leader }) => {
      if ( typeof leader === "string" ) {
        return {
          name: `L${state.participants.byId[leader].attendanceId}`,
          value: danceScores[leader] != null ? danceScores[leader][0].score : 0, // Same strange
        };
      } else {
        return {
          name: "",
          value: 0,
        };
      }
    })
    .sort((a, b) => b.value - a.value)
  const followerViewModels = pairs
    .map(({ follower }) => {
      if ( typeof follower === "string" ) {
        return {
          name: `L${state.participants.byId[follower].attendanceId}`,
          value: danceScores[follower] != null ? danceScores[follower][0].score : 0, // Same hack
        };
      } else {
        return {
          name: "",
          value: 0
        }
      }
    })
    .sort((a, b) => b.value - a.value)
  return [
    { title: 'Leaders', danceScores: leaderViewModels },
    { title: 'Followers', danceScores: followerViewModels },
  ]
}

const NoteTableContainer = connect<Props, OwnProps, StateProps, _, _, _>(mapStateToProps)(Component)

export default NoteTableContainer
