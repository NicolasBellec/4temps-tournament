// @flow

import React, { Component } from 'react';
import {
  Form, FormInput, Message, Button,
} from 'semantic-ui-react';

import type { Props } from "./types";

type State = {
  name: string,
};

class CreateAssistant extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.name);
  };

  render() {
    const { isValid, isLoading, createdSuccessfully } = this.props;
    const { name } = this.state;
    return (
      <Form loading={isLoading} error={!isValid} success={createdSuccessfully}>
        {createdSuccessfully && <Message success content="Success!" />}
        <FormInput label="Name" value={name} onChange={this.onChangeName} />
        {!isValid && <Message error content="Name must not be empty" />}
        <Button onClick={this.onSubmit}>Add assistant</Button>
      </Form>
    );
  }
}

export default CreateAssistant;
