// @flow

import React, { Component } from 'react';
import {
  Form,
  FormInput,
  FormGroup,
  FormRadio,
  Message,
  Button,
} from 'semantic-ui-react';

import type {
  Props,
  OnSubmitParams
} from "./types";

type State = OnSubmitParams;

class CreateJudge extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      judgeType: 'normal',
    };
  }

  onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onChangeJugeType = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: JudgeType },
  ) => {
    this.setState({ judgeType: value });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const { isValid, isLoading, createdSuccessfully } = this.props;
    const { name } = this.state;
    return (
      <Form loading={isLoading} error={!isValid} success={createdSuccessfully}>
        {createdSuccessfully && <Message success content="Success!" />}
        <FormInput label="Name" value={name} onChange={this.onChangeName} />
        {!isValid && <Message error content="Name must not be empty" />}
        <FormGroup>
          <FormRadio
            label="Normal"
            value="normal"
            onChange={this.onChangeJugeType}
            checked={this.state.judgeType === 'normal'}
          />
          <FormRadio
            label="Sanctioner"
            value="sanctioner"
            onChange={this.onChangeJugeType}
            checked={this.state.judgeType === 'sanctioner'}
          />
          <FormRadio
            label="President"
            value="president"
            onChange={this.onChangeJugeType}
            checked={this.state.judgeType === 'president'}
          />
        </FormGroup>
        <Button onClick={this.onSubmit}>Add judge</Button>
      </Form>
    );
  }
}

export default CreateJudge;
