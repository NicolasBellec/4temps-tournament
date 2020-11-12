// @flow

export type GroupViewModel = {
  id: string,
  pairs: Array<{
    id: string,
    follower: { name: string, number: string },
    leader: { name: string, number: string },
  }>,
  isStarted: boolean,
};

export type DanceNotes = {
  judgesNoted: Array<Judge>,
  judgesNotNoted: Array<Judge>,
};

export type RoundViewModel = {
  ...Round,
  activeGroup: ?number,
  activeDance: ?number,
  nextGroup: ?number,
  nextDance: ?number,
  groups: Array<GroupViewModel>,
  notes: DanceNotes,
};

export type OwnProps = {
  tournamentId: string,
  roundId: string,
}

export type DispatchProps = {
  startDance: () => void,
  generateGroups: () => void,
  endDance: () => void,
  regenerateGroup: (groupId: string) => void,
}

export type StateProps = {
  round: RoundViewModel,
  areAllGroupsGenerated: boolean,
}

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
}
