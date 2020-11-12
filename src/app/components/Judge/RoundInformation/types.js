// @flow

export type StateProps = {
  roundName: string,
  groupInformation: { group: DanceGroup, groupNumber: number },
  danceInformation: { danceNumber: number, numberOfDances: number },
};

export type DispatchProps = {
  dispatch: ReduxDispatch
};

export type Props = {
  ...StateProps,
  ...DispatchProps
};
