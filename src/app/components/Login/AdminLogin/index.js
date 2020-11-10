// @flow

import { connect } from 'react-redux';
import LoginComponent from './component';
import { getLoginUserAction } from '../../../action-creators/admin';

import type {
  Props,
  StateProps,
  OwnProps,
  DispatchProps
} from "./types";

function mapStateToProps({ ui }: ReduxState): StateProps {
  return ui.login;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { location, history }: OwnProps,
): DispatchProps {
  const referer = location.search.replace(/\?referer=/, '');
  return {
    onSubmit: (credentials: AdminCredentials) => {
      dispatch(getLoginUserAction(credentials, history, referer))
    },
  };
}

const LoginContainer = connect<Props, OwnProps, StateProps,_,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);

export default LoginContainer;
