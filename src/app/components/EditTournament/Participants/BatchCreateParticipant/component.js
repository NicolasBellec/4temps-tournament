// @flow

import React, { Component } from 'react'
import { Form, FormButton, FormGroup, FormInput, Message } from 'semantic-ui-react'

import type { ComponentState, Props } from './types'

class BatchCreateParticipant extends Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props)
    this.state = {
      csv: '',
    }
  }

  onChangeCSV = (event) => {
    this.setState({ csv: event.target.value })
  }

  onSubmit = async () => {
    this.props.onSubmit(this.state)
  }

  render() {
    const { isLoading, validation, error, isClassic } = this.props
    const { isValid } = validation
    const { csv } = this.state
    return (
      <div>
      <Form error={!isValid} loading={isLoading}>
        {this.props.createdSuccessfully && <Message positive content="Success!" />}
        <Form.TextArea
          label="CSV"
          value={csv}
          onChange={this.onChangeCSV}
          placeholder="Erven, leader # one per line"
        />
        {!isValid && <Message error content={error} />}
        <FormButton type="submit" onClick={this.onSubmit}>
          Add batch participants
        </FormButton>
      </Form>
      </div>
    )
  }
}

export default BatchCreateParticipant
