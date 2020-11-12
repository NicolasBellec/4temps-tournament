// @flow
import React, { PureComponent } from 'react';
import { Header, HeaderSubheader, Container } from 'semantic-ui-react';

import type {
  Props
} from "./types";

class RoundInformation extends PureComponent<Props> {
  render() {
    const { groupNumber } = this.props.groupInformation;
    const { danceNumber } = this.props.danceInformation;
    return (
      <Container>
        <Header as="h2">
          {this.props.roundName}
          <HeaderSubheader>
            Group:
            {groupNumber}
          </HeaderSubheader>
          <HeaderSubheader>
            Dance:
            {danceNumber}
          </HeaderSubheader>
        </Header>
      </Container>
    );
  }
}

export default RoundInformation;
