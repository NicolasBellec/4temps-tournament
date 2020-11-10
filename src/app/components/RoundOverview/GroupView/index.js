// no-flow

import { connect } from 'react-redux';

import Component from './component';
import { regenerateGroup } from '../../../api/round';
import {
  getStartNextDanceAction,
  getGenerateGroupsAction,
  getEndDanceAction,
} from '../../../action-creators/round';
import type {
  OwnProps,
  DispatchProps,
  StateProps,
  Props,
  RoundViewModel,
  DanceNotes
} from './types';

function areAllGroupsGenerated(
  viewModel: ?RoundViewModel,
  participantCount: number,
): boolean {
  if (!viewModel) {
    return true;
  }
  (viewModel: RoundViewModel);
  const participants = viewModel.groups
    .reduce(
      (participants, group) => [
        ...participants,
        ...group.pairs.reduce(
          (pairs, pair) => [...pairs, pair.leader.number, pair.follower.number],
          [],
        ),
      ],
      [],
    )
    .filter(Boolean);

  const uniqueParticipants = new Set(participants);
  return uniqueParticipants.size === participantCount;
}

function createViewModelsForRound(
  {
    rounds, participants, tournaments, judges,
  }: ReduxState,
  roundId: string,
  tournamentId: string,
): RoundViewModel {
  const round: Round = rounds.byId[roundId];

  const { groups: DanceGroup[], ...rest } = (round: Round);
  let activeDanceId: ?string;
  let activeDance: ?number;
  const activeGroup: ?number = getActiveGroup(groups);
  const nextDance: ?number = getNextDance(groups);
  const nextGroup: ?number = getNextGroup(groups);
  for (let i = 0; i < groups.length; ++i) {
    for (let j = 0; j < groups[i].dances.length; ++j) {
      if (groups[i].dances[j].active) {
        activeDance = j + 1;
        activeDanceId = groups[i].dances[j].id;
      }
    }
  }
  const notes: DanceNotes = activeDance != null
    ? getNotes(activeDanceId, tournaments.byId[tournamentId], judges)
    : { judgesNoted: [], judgesNotNoted: [] };

  const viewModel: RoundViewModel = {
    ...(rest: $Rest<Round, {| groups: Array < DanceGroup > |}>),
    activeDance,
    activeGroup,
    nextDance,
    nextGroup,
    notes,
    groups: groups.map((g) => ({
      id: g.id,
      pairs: g.pairs.map((p, i) => ({
        id: i.toString(),
        leader: createParticipantViewModel(participants.byId[p.leader || '']),
        follower: createParticipantViewModel(
          participants.byId[p.follower || ''],
        ),
      })),
      isStarted: g.dances.reduce(
        (isStarted, { active, finished }) => isStarted || active || finished,
        false,
      ),
    })),
  };

  return viewModel;
}

function getNotes(danceId, tournament, judges) {
  const tournamentJudges = judges.forTournament[tournament.id];
  const dancesNoted = tournament.dancesNoted || {};
  const judgesNoted = [];
  const judgesNotNoted = [];
  for (const judgeId of tournamentJudges) {
    const judgeNotes = dancesNoted[judgeId] || [];
    const judge = judges.byId[judgeId];
    if (judgeNotes.includes(danceId)) {
      judgesNoted.push(judge);
    } else {
      judgesNotNoted.push(judge);
    }
  }
  return {
    judgesNoted,
    judgesNotNoted,
  };
}

function getActiveGroup(groups) {
  const activeGroups = [...Array(groups.length).keys()].filter((i) => {
    const group = groups[i];
    return group.dances
      .map((d) => !d.finished)
      .reduce((ack, r) => ack || r, false);
  });
  return activeGroups.length > 0 ? activeGroups[0] + 1 : null;
}

function getNextGroup(groups) {
  const groupsNotDanced = [...Array(groups.length).keys()].filter((i) => notDanced(groups[i]));
  return groupsNotDanced.length > 0 ? groupsNotDanced[0] + 1 : null;
}

function notDanced(group) {
  return !group.dances
    .map((dance) => dance.finished || dance.active)
    .reduce((ack, r) => ack || r, false);
}

function getNextDance(groups) {
  let nextDance = 1;
  const relevantGroups = groups.filter(
    (group) => !group.dances.map((d) => d.finished).reduce((ack, r) => ack && r, true),
  );
  if (relevantGroups.length != 0) {
    const { dances } = relevantGroups[0];
    const nonStartedDances = [...Array(dances.length).keys()].filter(
      (i) => !(dances[i].finished || dances[i].active),
    );
    if (nonStartedDances.length > 0) {
      nextDance = nonStartedDances[0] + 1;
    }
  }
  return nextDance;
}

function createParticipantViewModel(participant: ?Participant) {
  if (participant) {
    const { name, attendanceId } = participant;
    return { name, number: attendanceId.toString() };
  }
  return { name: '', number: '' };
}

function mapStateToProps(state: ReduxState, { roundId, tournamentId }: OwnProps): StateProps {
  const viewModel = createViewModelsForRound(state, roundId, tournamentId);

  return {
    round: viewModel,
    areAllGroupsGenerated: areAllGroupsGenerated(
      viewModel,
      (state.participants.forTournament[tournamentId]
        && state.participants.forTournament[tournamentId].length)
        || 0,
    ),
  };
}


function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { roundId, tournamentId }: OwnProps,
): DispatchProps {
  return {
    startDance: () => dispatch(getStartNextDanceAction(tournamentId)),
    generateGroups: () => {
      dispatch(getGenerateGroupsAction(tournamentId, roundId));
    },
    endDance: () => dispatch(getEndDanceAction(tournamentId)),
    regenerateGroup: (groupId: string) => {
      regenerateGroup(tournamentId, roundId, groupId);
    },
  };
}

const connector = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
);

const RoundGroupContainer = connector(Component);

export default RoundGroupContainer;
