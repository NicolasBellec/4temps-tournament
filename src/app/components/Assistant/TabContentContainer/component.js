// no-flow

import React from 'react';
import GroupsContainer from '../GroupsContainer';
import Participants from '../../EditTournament/Participants';
import {
  Tabs,
} from '../types';

export default function TabContent({
  activeTab,
  tournamentId,
}: {
  activeTab: Tabs,
  tournamentId: string,
}) {
  if (activeTab === 'groups') {
    return <GroupsContainer tournamentId={tournamentId} />;
  }
  if (activeTab === 'participants') {
    return <Participants tournamentId={tournamentId} />;
  }
  return 'Invalid tab';
}
