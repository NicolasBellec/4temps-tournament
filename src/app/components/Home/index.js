// @flow

import { connect } from 'react-redux';

import HomeComponent from './component';

import type { Props, OwnProps, StateProps } from './types';

function mapStateToProps({ user }: ReduxState): StateProps {
  return {
    isAuthenticated: user.id !== '',
    role: user.role,
  };
}

const HomeContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
)(HomeComponent);

export default HomeContainer;
