// no-flow
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import type { Location, RouterHistory } from 'react-router-dom'
import { getLogoutUserAction } from '../../action-creators/admin'
import NavigationBar from './component'

type Props = {
  location: Location,
  history: RouterHistory,
}

function getActivePath(location: string): string {
  const matches = location.match(/\/(.+)\/?\??.*/)
  let activeName = 'home'
  if (matches) {
    activeName = matches[1]
  }
  return activeName
}

function mapStateToProps({ user }: ReduxState, { location }: Props) {
  return {
    activePath: getActivePath(location.pathname),
    isAuthenticated: user.id !== '',
    role: user.role,
  }
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: { history: RouterHistory }) {
  return {
    onClickLogout: () => dispatch(getLogoutUserAction(history)),
  }
}

const NavigationBarContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationBar)
)

export default NavigationBarContainer
