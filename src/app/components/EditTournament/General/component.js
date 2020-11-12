// @flow
import React, { Component } from 'react'
import { Container, Form, FormButton, FormInput, Message, Button } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import type Moment from 'moment'
import moment from 'moment'

import type { Props } from './types'

type State = {
  name: string,
  date: Moment,
}

class EditTournamentGeneral extends Component<Props, State> {
  constructor(props: Props) {
    const { tournament } = props
    super(props)
    this.state = {
      name: tournament ? tournament.name : '',
      date: tournament ? tournament.date : moment(),
    }
  }

  componentWillReceiveProps({ tournament }: Props) {
    if (tournament) {
      const { name, date } = tournament

      if (
        !this.props.tournament ||
        this.props.tournament.name !== name ||
        this.props.tournament.date !== date
      ) {
        this.setState({ name, date })
      }
    }
  }

  onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  onChangeDate = (date: ?Moment) => {
    if (date != null) {
      this.setState({ date })
    }
  }

  onSubmit = () => {
    const { name, date } = this.state
    const { tournament } = this.props
    if (tournament) {
      this.props.onSubmit({ ...tournament, name, date })
    }
  }

  render() {
    const { onClickLeaderboard, isValidName, isValidDate } = this.props
    const { name, date } = this.state

    return (
      <Container>
        <Button onClick={onClickLeaderboard}>Go to leaderboard</Button>
        <Form error={!isValidName || !isValidDate}>
          <FormInput
            label="Name"
            placeholder="4Temps World Championship"
            value={name}
            onChange={this.onChangeName}
          />
          {!isValidName && <Message error content="Invalid name" />}
          <FormInput
            label="Date"
            control={DatePicker}
            allowSameDay
            selected={date}
            onChange={this.onChangeDate}
          />
          {!isValidDate && <Message error content="Invalid date" />}
          <FormButton onClick={this.onSubmit}>Submit</FormButton>
        </Form>
      </Container>
    )
  }
}

export default EditTournamentGeneral
