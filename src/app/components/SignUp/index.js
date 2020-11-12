// @flow
import { connect } from 'react-redux'
import SignUp from './component'
import { getSignUpAction } from '../../action-creators/admin'

import type { Props, StateProps, OwnProps, DispatchProps } from './types'

function mapStateToProps({ ui }: ReduxState): StateProps {
  return ui.signUp
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history, location }: OwnProps
): DispatchProps {
  return {
    onSubmit: (admin: AdminWithPassword) => {
      dispatch(getSignUpAction(admin, history, location))
    },
  }
}

const SignUpContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(SignUp)

export default SignUpContainer
