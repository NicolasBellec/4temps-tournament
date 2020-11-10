// @flow

export type Tabs = 'groups' | 'participants';

export type Props = { tournamentId: string };
export type State = { activeTab: Tabs };

export type StateProps = {
  tournamentId: string
};
// type OwnProps;
