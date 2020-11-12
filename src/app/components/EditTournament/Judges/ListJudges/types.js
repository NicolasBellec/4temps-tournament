// @flow

import type { ElementType } from 'react';

export type OwnProps = {
  tournamentId: string,
};

export type StateProps = {
  child: ElementType,
  shouldLoad: boolean,
  judges: Array<JudgeViewModel>,
};

export type JudgeViewModel = {
  data: ?Judge,
  accessKey: ?AccessKey,
};

export type DispatchProps = {
  load: () => void,
};

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
};
