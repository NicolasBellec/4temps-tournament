// no-flow
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import LoginComponent from './component';
import { getLoginWithAccessKey } from '../../../action-creators/access-key';

type Props = {
  history: RouterHistory,
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.judgeLogin;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: Props) {
  return {
    onSubmit: (accessKey: string) => dispatch(getLoginWithAccessKey(accessKey))
  };
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);

export default LoginContainer;
