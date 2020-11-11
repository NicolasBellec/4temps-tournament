// @flow

import React, { Component } from 'react';
import {
  Container,
  Menu,
  MenuItem,
} from 'semantic-ui-react';
import type {
  Props,
  State,
  Tabs
} from './types';
import TabContentContainer from './TabContentContainer';

function TabMenu({
  activeTab,
  onClickTab,
}: {
  activeTab: Tabs,
  onClickTab: (tab: Tabs) => void,
}) {
  return (
    <Menu tabular>
      <MenuItem
        active={activeTab === 'groups'}
        onClick={() => onClickTab('groups')}
      >
        Groups
      </MenuItem>
      <MenuItem
        active={activeTab === 'participants'}
        onClick={() => onClickTab('participants')}
      >
        Participants
      </MenuItem>
    </Menu>
  );
}

export default class AssistantView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: 'groups',
    };
  }

  render() {
    const { activeTab } = this.state;
    const { tournamentId } = this.props;
    return (
      <Container>
        <TabMenu
          activeTab={activeTab}
          onClickTab={(tab) => this.setState({ activeTab: tab })}
        />
        <TabContentContainer
          activeTab={activeTab}
          tournamentId={tournamentId}
        />
      </Container>
    );
  }
}
