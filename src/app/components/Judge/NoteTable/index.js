// TODO: set flow. Currently some weird error which takes all CPU during flow parsing
/* eslint-disable flowtype/no-types-missing-file-annotation */

import { connect } from 'react-redux';
import DanceScorer from '../../../../domain/dance-scorer';
import type { StateProps, ColumnViewModel } from './component';
import Component from './component';

function mapStateToProps(state: ReduxState): StateProps {
  const tournament = getTournament(state);
  const activeRound = getActiveRound(state);

  const danceId = getActiveDanceId(activeRound);
  const notes = getNotesForActiveDance(state, danceId);

  const danceScores = new DanceScorer(
    tournament.judges,
    activeRound.criteria,
    notes,
    { allowNegative: true, countPresident: true },
  ).scoreDance(danceId);

  return {
    columns: divideScoreIntoColumns(state, danceScores),
    tournamentId: state.tournaments.forJudge,
  };
}

function getTournament(state: ReduxState): Tournament {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  return {
    ...tournament,
    rounds: tournament.rounds.map((id) => state.rounds.byId[id]),
    judges: tournament.judges.map((id) => state.judges.byId[id]),
  };
}

function getNotesForActiveDance(
  state: ReduxState,
  activeDanceId: string,
): Array<JudgeNote> {
  return Object.keys(state.notes.byParticipant)
    .reduce(
      (notes, participantId) => [
        ...notes,
        ...Object.keys(state.notes.byParticipant[participantId]).reduce(
          (acc, critId) => [
            ...acc,
            state.notes.byParticipant[participantId][critId],
          ],
          [],
        ),
      ],
      [],
    )
    .filter(({ danceId }) => danceId === activeDanceId);
}

function getActiveDanceId(round: Round): string {
  return round.groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active);
    if (dance) {
      return dance.id;
    }
    return res;
  }, '');
}

function getActiveRound(state: ReduxState): Round {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  const rounds = tournament.rounds.map((id) => state.rounds.byId[id]);
  // $FlowFixMe
  return rounds.reduce((res, round) => (round.active ? round : res), null);
}

function divideScoreIntoColumns(
  state: ReduxState,
  danceScores: Array<Score>,
): Array<ColumnViewModel> {
  const scoreMap = danceScores.reduce(
    (acc, score) => ({
      ...acc,
      [score.participantId]: score,
    }),
    {},
  );
  if (isLastRound(state) || isClassicTournament(state)) {
    return [getPairColumn(state, scoreMap, getPairs(state))];
  }
  return getSeparateColumns(state, scoreMap, getPairs(state));
}

function isClassicTournament(state: ReduxState) {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  return tournament.type === 'classic';
}

function isLastRound(state: ReduxState) {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  const activeRound = getActiveRound(state);
  return activeRound.id === tournament.rounds[tournament.rounds.length - 1];
}

function getPairs(state: ReduxState): Array<Pair> {
  return getActiveRound(state).groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active);
    if (dance) {
      return group.pairs;
    }
    return res;
  }, []);
}

function getPairColumn(
  state: ReduxState,
  danceScores: { [id: string]: Array<Score> },
  pairs: Array<Pair>,
): ColumnViewModel {
  const scoreViewModels = pairs
    .map((pair) => ({
      name: getPairName(state, pair),
      value:
        danceScores[pair.leader] != null ? danceScores[pair.leader].score : 0,
    }))
    .sort((a, b) => b.value - a.value);
  return { title: 'Couples', danceScores: scoreViewModels };
}

function getPairName(state: ReduxState, { leader, follower }: Pair) {
  if (isClassicTournament(state)) {
    return state.participants.byId[leader].attendanceId;
  }
  return `L${state.participants.byId[leader].attendanceId} - F${state.participants.byId[follower].attendanceId}`;
}

function getSeparateColumns(
  state: ReduxState,
  danceScores: { [id: string]: Array<Score> },
  pairs: Array<Pair>,
): Array<ColumnViewModel> {
  const leaderViewModels = pairs
    .map(({ leader }) => ({
      name: `L${state.participants.byId[leader].attendanceId}`,
      value: danceScores[leader] != null ? danceScores[leader].score : 0,
    }))
    .sort((a, b) => b.value - a.value);
  const followerViewModels = pairs
    .map(({ follower }) => ({
      name: `L${state.participants.byId[follower].attendanceId}`,
      value: danceScores[follower] != null ? danceScores[follower].score : 0,
    }))
    .sort((a, b) => b.value - a.value);
  return [
    { title: 'Leaders', danceScores: leaderViewModels },
    { title: 'Followers', danceScores: followerViewModels },
  ];
}

const NoteTableContainer = connect(mapStateToProps)(Component);

export default NoteTableContainer;
