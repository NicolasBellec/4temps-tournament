// @flow
import React, { PureComponent } from 'react';

import LoginContainer from '../Login';
// $FlowFixMe
import Judge from '../Judge';
import EditTournamentList from '../EditTournamentList';
import Assistant from '../Assistant';

import type {
  Props
} from "./types";

class Home extends PureComponent<Props> {
  renderForRole() {
    const { role, history, location } = this.props;
    if (role == 'admin') {
      return <EditTournamentList history={history} />;
    }
    if (role == 'judge') {
      return <Judge />;
    }
    if (role == 'assistant') {
      return <Assistant />;
    }
    return (
      <LoginContainer
        location={location}
        history={history}
      />);
  }

  render() {
    return this.renderForRole();
  }
}

export default Home;
