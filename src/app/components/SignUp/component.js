// @flow
import React, { Component } from 'react';
import {
  Header, Form, FormInput, Button, Message,
} from 'semantic-ui-react';

import type {
  Props,
  InternalState
} from "./types";

import './styles.css';

class SignUp extends Component<Props, InternalState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  onChangeFirstName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ firstName: event.target.value });
  };

  onChangeLastName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ lastName: event.target.value });
  };

  onChangeEmail = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const { isLoading, validation } = this.props;
    const {
      isValid,
      isValidFirstName,
      isValidLastName,
      isValidEmail,
      isEmailNotUsed,
      isValidPassword
     } = validation;
    const {
      firstName,
      lastName,
      email,
      password
    } = this.state;
    return (
      <div styleName="center">
        <div styleName="width">
          <Header as="h1">Sign up</Header>
          <Form
            loading={isLoading}
            error={!isValid}
          >
            <FormInput
              label="First name"
              placeholder="John"
              value={firstName}
              onChange={this.onChangeFirstName}
            />
            {!isValidFirstName && (
              <Message error content="Invalid first name" />
            )}
            <FormInput
              label="Last name"
              placeholder="Smith"
              value={lastName}
              onChange={this.onChangeLastName}
            />
            {!isValidLastName && (
              <Message error content="Invalid last name" />
            )}
            <FormInput
              label="Email"
              placeholder="john@gmail.com"
              value={email}
              onChange={this.onChangeEmail}
            />
            {!isValidEmail && (
              <Message error content="Invalid email" />
            )}
            {!isEmailNotUsed && (
              <Message
                error
                content="An account already exists with this email"
              />
            )}
            <FormInput
              label="Password"
              type="password"
              value={password}
              placeholder="P4ssw0rd"
              onChange={this.onChangePassword}
            />
            {!isValidPassword && (
              <Message error content="A password is at least 8 characters" />
            )}
            <Button onClick={this.onSubmit} type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUp;
