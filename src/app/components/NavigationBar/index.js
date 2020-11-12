// @flow
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getLogoutUserAction } from '../../action-creators/admin'
import NavigationBar from './component'

import type {
  OwnProps,
  Props,
  DispatchProps,
  StateProps
} from "./types";

function getActivePath(location: string): string {
  const matches = location.match(/\/(.+)\/?\??.*/)
  let activeName = 'home'
  if (matches) {
    activeName = matches[1]
  }
  return activeName
}

function mapStateToProps(
  { user }: ReduxState,
  { location }: OwnProps
) : StateProps {
  return {
    activePath: getActivePath(location.pathname),
    isAuthenticated: user.id !== '',
    role: user.role,
  }
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history }: OwnProps
) : DispatchProps {
  return {
    onClickLogout: () => dispatch(getLogoutUserAction(history)),
  }
}

const NavigationBarContainer = withRouter(
  connect<Props, OwnProps, StateProps, _,_,_>(
    mapStateToProps,
    mapDispatchToProps
  )(NavigationBar)
)

export default NavigationBarContainer
