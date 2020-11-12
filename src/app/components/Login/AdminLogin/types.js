// @flow

import type { RouterHistory, Location } from 'react-router-dom'

export type OwnProps = {
  location: Location,
  history: RouterHistory,
  headerTitle: string,
}

export type StateProps = {
  isLoading: boolean,
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesAdminExist: boolean,
}

export type DispatchProps = {
  onSubmit: (credentials: AdminCredentials) => void,
}

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}
