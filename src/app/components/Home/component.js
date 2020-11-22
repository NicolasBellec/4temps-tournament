// @flow
import React, { PureComponent } from 'react'

import { Redirect } from 'react-router-dom'

import Judge from '../Judge'
import Assistant from '../Assistant'

import type { Props } from './types'

class Home extends PureComponent<Props> {
  renderForRole() {
    const { role, history, location, isAuthenticated } = this.props
    if (isAuthenticated && role == 'admin') {
      return <Redirect to="/tournament/edit" />
    }
    if (isAuthenticated && role == 'judge') {
      return <Judge />
    }
    if (isAuthenticated && role == 'assistant') {
      return <Assistant />
    }
    return <Redirect to="/login" />
  }

  render() {
    return this.renderForRole()
  }
}

export default Home
