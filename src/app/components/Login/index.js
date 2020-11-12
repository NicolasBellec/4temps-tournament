// @flow
import React, { Component } from 'react'
import type { Location, RouterHistory } from 'react-router-dom'

import AdminLogin from './AdminLogin'
import AccessKeyLogin from './AccessKeyLogin'

type Props = {
  location: Location,
  history: RouterHistory,
}

class Login extends Component<Props> {
  static credentialHeader = 'Admin Login'

  static accessKeyHeader = 'Staff Login'

  render() {
    const { location, history } = this.props
    return (
      <div>
        <AccessKeyLogin headerTitle={Login.accessKeyHeader} history={history} />
        <AdminLogin headerTitle={Login.credentialHeader} location={location} history={history} />
      </div>
    )
  }
}
export default Login
