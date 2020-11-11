// @flow
import React, { Component } from 'react';
import {
  Form,
  FormButton,
  FormRadio,
  FormGroup,
  FormInput,
  Message,
} from 'semantic-ui-react';

import type {
  ComponentState,
  Props
} from "./types";

class CreateParticipant extends Component<Props, ComponentState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      role: 'none',
    };
  }

  onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ name: event.target.value });

  onChangeRadio = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: ParticipantRole },
  ) => this.setState({ role: value });

  onSubmit = async () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const { isLoading, validation, isClassic } = this.props;
    const { isValidParticipant, isValidName, isValidRole } = validation;
    const { name, role } = this.state;
    return (
      <Form error={!isValidParticipant} loading={isLoading}>
        {this.props.createdSuccessfully && (
          <Message positive content="Success!" />
        )}
        <FormInput label="Name" value={name} onChange={this.onChangeName} />
        {!isValidName && <Message error content="Invalid name" />}
        <FormGroup id="role-radio" inline>
          <label htmlFor="role-radio">Role</label>
          <FormRadio
            label={isClassic ? 'Pair' : 'Leader'}
            value="leader"
            onChange={this.onChangeRadio}
            checked={role === 'leader'}
          />
          <FormRadio
            label={isClassic ? 'Dummy' : 'Follower'}
            value="follower"
            onChange={this.onChangeRadio}
            checked={role === 'follower'}
          />
          {!isClassic && (
            <FormRadio
              label="Both leader and follower"
              value="leaderAndFollower"
              onChange={this.onChangeRadio}
              checked={role === 'leaderAndFollower'}
            />
          )}
        </FormGroup>
        {!isValidRole && <Message error content="Must select a role" />}
        <FormButton type="submit" onClick={this.onSubmit}>
          Add participant
        </FormButton>
      </Form>
    );
  }
}

export default CreateParticipant;
