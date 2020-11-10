// no-flow

import type { Tabs } from "../types";

export type OwnProps = {
  tournamentId: string
};

export type DispatchProps = {
  load: () => void
};

export type TabContentTy = (
  activeTab: Tabs,
  tournamentId: string
) => (Component | string)

export type StateProps = {
  Child: TabContentTy,
  shouldLoad: boolean,
  ...OwnProps
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
}
