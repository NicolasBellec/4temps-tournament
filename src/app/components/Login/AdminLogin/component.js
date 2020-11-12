// @flow

import React, { PureComponent } from 'react';
import {
  Button, Form, FormInput, Header, Message,
} from 'semantic-ui-react';

import type { Props } from './types';

import './styles.css';

type State = AdminCredentials;

class Login extends PureComponent<Props, State> {
  static defaultProps = {
    headerTitle: 'Log in',
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  onEmailChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const {
      headerTitle,
      isLoading,
      isValid,
      isValidEmail,
      isValidPassword,
      doesAdminExist,
    } = this.props;

    const { email, password } = this.state;

    return (
      <div styleName="center">
        <div styleName="width">
          <Header as="h1">{headerTitle}</Header>
          <Form loading={isLoading} error={!isValid}>
            <FormInput
              label="Email"
              placeholder="john@gmail.com"
              value={email}
              onChange={this.onEmailChange}
            />
            {!isValidEmail && <Message error content="Invalid email address" />}
            <FormInput
              type="password"
              label="Password"
              placeholder="P4ssw0rd"
              value={password}
              onChange={this.onPasswordChange}
            />
            {!isValidPassword && <Message error content="Invalid password" />}
            <Button type="submit" onClick={this.onSubmit}>
              Submit
            </Button>
            {!doesAdminExist && (
              <Message error content="Invalid email or password" />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
