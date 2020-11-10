// @flow
import React, { Component } from 'react';
import {
  Container,
  Button,
  Form,
  FormField,
  FormInput,
  FormRadio,
  FormGroup,
  Message,
} from 'semantic-ui-react';
import moment from 'moment';
import type Moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import type {
  Props,
  ComponentState,
} from "./types";

class CreateTournament extends Component<Props, ComponentState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      date: moment(),
      type: 'none',
    };
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>): void => {
    this.setState({ name: event.target.value });
  };

  _onChangeDate = (date: ?Moment): void => {
    if (date != null) {
      this.setState({ date });
    }
  };

  _onChangeRadio = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: TournamentType },
  ): void => {
    this.setState({ type: value });
  };

  _onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <Container>
        <Form
          loading={this.props.isLoading}
          error={!this.props.validation.isValidTournament}
        >
          <FormInput
            label="Name"
            placeholder="4Temps World Championship"
            value={this.state.name}
            onChange={this._onChangeName}
          />
          {!this.props.validation.isValidName && (
            <Message error content="Invalid name" />
          )}
          <FormInput
            label="Date"
            control={DatePicker}
            allowSameDay
            selected={this.state.date}
            onChange={this._onChangeDate}
          />
          {!this.props.validation.isValidDate && (
            <Message error content="Invalid date" />
          )}
          <FormGroup inline>
            <FormField label="Tournament Type" />
            <FormRadio
              label="Classic"
              value="classic"
              onChange={this._onChangeRadio}
              checked={this.state.type === 'classic'}
            />
            <FormRadio
              label="Jack n' Jill"
              value="jj"
              onChange={this._onChangeRadio}
              checked={this.state.type === 'jj'}
            />
          </FormGroup>
          {!this.props.validation.isValidType && (
            <Message error content="Must select a type" />
          )}
          <Button type="submit" onClick={this._onSubmit}>
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default CreateTournament;
