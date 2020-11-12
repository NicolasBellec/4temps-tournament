// @flow

import React, { PureComponent } from 'react';
import {
  Button, Form, FormInput, Header, Message,
} from 'semantic-ui-react';

import type { Props } from './types';

import './styles.css';

type State = {
  accessKey: string,
};

class Login extends PureComponent<Props, State> {
  static defaultProps = {
    headerTitle: 'Log in',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      accessKey: '',
    };
  }

  onAccessKeyChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ accessKey: event.target.value });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.accessKey);
  };

  render() {
    const {
      headerTitle,
      isLoading,
      isValidAccessKey,
      doesAccessKeyExist,
    } = this.props;
    const { accessKey } = this.state;

    return (
      <div styleName="center">
        <div styleName="width">
          <Header as="h1">{headerTitle}</Header>
          <Form
            loading={isLoading}
            error={!isValidAccessKey || !doesAccessKeyExist}
          >
            <FormInput
              label="Access Key"
              placeholder="exd618d5f1"
              value={accessKey}
              onChange={this.onAccessKeyChange}
            />
            {!isValidAccessKey && (
              <Message error content="Access keys are 10 characters long" />
            )}
            <Button type="submit" onClick={this.onSubmit}>
              Submit
            </Button>
            {!doesAccessKeyExist && (
              <Message error content="Access key does not exist!" />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
