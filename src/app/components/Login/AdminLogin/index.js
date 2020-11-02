// no-flow

import { connect } from 'react-redux';
import type { RouterHistory, Location } from 'react-router-dom';
import LoginComponent from './component';
import { getLoginUserAction } from '../../../action-creators/admin';

type Props = {
  location: Location,
  history: RouterHistory,
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.login;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { location, history }: Props,
) {
  const referer = location.search.replace(/\?referer=/, '');
  return {
    onSubmit: (credentials: AdminCredentials) => dispatch(getLoginUserAction(credential, history, referer)),
  };
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);

export default LoginContainer;
