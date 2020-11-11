// @flow

import React from 'react';
import GroupsContainer from '../GroupsContainer';
import Participants from '../../EditTournament/Participants';
import type {
  Props,
} from './types';

export default function TabContent({
  activeTab,
  tournamentId,
}: Props) {
  if (activeTab === 'groups') {
    return <GroupsContainer tournamentId={tournamentId} />;
  }
  if (activeTab === 'participants') {
    return <Participants tournamentId={tournamentId} />;
  }
  return 'Invalid tab';
}
