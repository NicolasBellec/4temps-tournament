// @flow

import type { RouterHistory } from 'react-router-dom';

export type OwnProps = {
  history: RouterHistory,
  headerTitle: string,
};

export type StateProps = {
  isLoading: boolean,
  isValidAccessKey: boolean,
  doesAccessKeyExist: boolean,
};

export type DispatchProps = {
  onSubmit: (accessKey: string) => void,
};

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
};
