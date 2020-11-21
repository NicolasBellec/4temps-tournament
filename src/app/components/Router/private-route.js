// @flow

import React from 'react'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import SignUpOrLoginWithRouter from '../SignUpOrLogin'
import type { Props, OwnProps, StateProps } from './types'

const PrivateRoute = ({
  Component,
  isAuthenticated,
  referer,
  history,
  location,
  ...rest
}: Props) => {
  return (
    <Route
      history={history}
      location={location}
      {...rest}
      render={props =>
        isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <SignUpOrLoginWithRouter
            history={history}
            header="Please log in or sign up"
            referer={referer}
          />
        )
      }
    />
  )
}

function mapStateToProps({ user }: ReduxState, { location }: OwnProps): StateProps {
  return {
    isAuthenticated: user.id !== '',
    referer: location.pathname,
  }
}

const connector = connect<Props, OwnProps, StateProps, _, _, _>(mapStateToProps)
const PrivateRouteConnected = connector(PrivateRoute)

const PrivateRouteContainer = withRouter(PrivateRouteConnected)

export default PrivateRouteContainer
