// @flow

import type { ElementType } from 'react';
import type { Tabs } from "../types";

export type OwnProps = {
  tournamentId: string,
  activeTab: Tabs
};

export type DispatchProps = {
  load: () => void
};

export type StateProps = {
  child: ElementType,
  shouldLoad: boolean
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
};
