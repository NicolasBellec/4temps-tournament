// @flow

export type PairViewModel = {
  id: string,
  name: string,
  hasAllNotes: boolean,
};

export type OwnProps = {
  roundId: string,
};

export type StateProps = {
  upperLayerPairs: Array<?PairViewModel>,
  lowerLayerPairs: Array<?PairViewModel>,
  activePairId: string,
};

export type DispatchProps = {
  onClickPair: (id: string) => void,
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
};
