// @flow
import { connect } from 'react-redux';
import LoginComponent from './component';
import { getLoginWithAccessKey } from '../../../action-creators/access-key';

import type {
  OwnProps,
  StateProps,
  DispatchProps,
  Props
} from "./types";

function mapStateToProps(
  { ui }: ReduxState,
  props: OwnProps
): StateProps {
  return ui.judgeLogin;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history }: OwnProps
): DispatchProps {
  return {
    onSubmit: (accessKey: string) => {
      dispatch(getLoginWithAccessKey(accessKey, history))
    },
  };
}

const LoginContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);

export default LoginContainer;
