// @flow

import { connect } from 'react-redux';
import Component from './component';
import type {
  CriterionViewModel,
  StateProps,
  DispatchProps,
  Props,
} from './types';
import { getSetNoteAction } from '../../../../action-creators/note';

function mapStateToProps(state: ReduxState): StateProps {
  const round = getRound(state);
  const tournamentId = getTournamentId(state);
  const danceId = getActiveDanceId(round);
  const judgeId = state.user.id;
  const pairId = getPairId(state);

  const judge = state.judges.byId[judgeId];

  return {
    tournamentId,
    danceId,
    judgeId,
    pairId,
    criteria: getCriteriaForJudgeType(state, pairId, judge.judgeType),
  };
}

function getPairId(state: ReduxState) {
  let pairId = state.ui.notes.selectedPair;
  if (pairId == null) {
    const pair = getFirstPair(getRound(state));
    pairId = `${String(pair.leader)}${String(pair.follower)}`;
  }

  return pairId;
}

function getTournamentId(state: ReduxState) {
  return state.tournaments.byId[state.tournaments.forJudge].id;
}

function getActiveDanceId(round: Round): string {
  return round.groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active);
    if (dance != null) {
      return dance.id;
    }
    return res;
  }, '');
}

function getFirstPair(round: Round): Pair {
  return round.groups.reduce(
    (res, group) => {
      if (group.dances.findIndex(({ active }) => active) !== -1) {
        return group.pairs[0];
      }
      return res;
    },
    { leader: null, follower: null },
  );
}

function getRound(state: ReduxState): Round {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  const activeRoundId = tournament.rounds.filter(
    (roundId) => state.rounds.byId[roundId].active,
  )[0];

  return state.rounds.byId[activeRoundId];
}

function getCriteriaForJudgeType(
  state: ReduxState,
  pairId: string,
  judgeType: JudgeType,
): Array<CriterionViewModel> {
  return getRound(state)
    .criteria.filter((criterion) => (criterion.forJudgeType === 'normal'
      ? judgeType === 'normal' || judgeType === 'president'
      : criterion.forJudgeType === judgeType))
    .map((crit) => ({
      id: crit.id,
      name: crit.name,
      description: crit.description,
      minValue: crit.minValue,
      maxValue: crit.maxValue,
      value: getValue(state.notes, pairId, crit.id),
      forJudgeType: crit.forJudgeType,
    }));
}

function getValue(notes: NotesReduxState, pairId: string, criterionId: string) {
  const { leaderId, followerId } = getIds(pairId);

  const leaderValue = notes.byParticipant[leaderId] != null
    ? notes.byParticipant[leaderId][criterionId] != null
      ? notes.byParticipant[leaderId][criterionId].value
      : null
    : null;

  const followerValue = notes.byParticipant[followerId] != null
    ? notes.byParticipant[followerId][criterionId] != null
      ? notes.byParticipant[followerId][criterionId].value
      : null
    : null;

  return leaderValue === followerValue ? leaderValue : null;
}

function getIds(pairId: string): { leaderId: string, followerId: string } {
  const leaderId = pairId.substr(0, pairId.length / 2);
  const followerId = pairId.substr(pairId.length / 2);

  return { leaderId, followerId };
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    onClick: (tournamentId: string, note: JudgeNote) => {
      const { leaderId, followerId } = getIds(note.participantId);
      dispatch(getSetNoteAction(tournamentId, note, leaderId));
      dispatch(getSetNoteAction(tournamentId, note, followerId));
    },
  };
}

const PairNoteTakerContainer = connect<Props, {}, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default PairNoteTakerContainer;
