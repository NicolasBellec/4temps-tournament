// @flow

import TabContent from './component'
import type { Tabs } from '../types'

export type OwnProps = {
  tournamentId: string,
  activeTab: Tabs,
}

export type DispatchProps = {
  load: () => void,
}

export type StateProps = {
  Child: typeof TabContent,
  shouldLoad: boolean,
}

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
}
