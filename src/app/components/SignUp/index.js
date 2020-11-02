// no-flow
import { connect } from 'react-redux';
import type { Location, RouterHistory } from 'react-router-dom';

import SignUp from './component';
import { getSignUpAction } from '../../action-creators/admin';

type Props = {
  history: RouterHistory,
  location: Location,
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.signUp;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history, location }: Props,
) {
  return {
    onSubmit: (admin: AdminWithPassword) => dispatch(getSignUpAction(admin, history, location)),
  };
}

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUpContainer;
