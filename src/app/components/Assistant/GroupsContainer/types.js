// @flow

export type OwnProps = {
  tournamentId: string
};

export type StateProps = {
  hasActiveRound: boolean,
  roundName: string,
  groups: Array<{ number: number, pairs: Array<string> }>,
};

export type Props = {
  ...StateProps,
  ...OwnProps
};
