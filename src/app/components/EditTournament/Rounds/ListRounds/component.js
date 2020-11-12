// @flow

import React, { Component } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  Button,
  Icon,
  Header,
  Card,
  Container,
  Progress,
  Accordion,
  SyntheticEvent,
  Modal,
} from 'semantic-ui-react';
import './styles.css';
import CreateRound from '../CreateRound';

import type { Props } from './types';

type State = {
  activeIndex: number,
};

class RoundList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: -1,
    };
  }

  handleClick = (
    e: SyntheticEvent<HTMLInputElement>,
    titleProps: { index: number },
  ) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  renderItem = (round: Round) => (
    <TableRow key={round.id}>
      <TableCell selectable onClick={() => this.props.onClick(round.id)}>
        {round.name}
      </TableCell>
      {!(round.active || round.finished) && (
        <TableCell textAlign="right">
          <Button
            size="tiny"
            floated="right"
            onClick={() => this.props.deleteRound(round.id)}
          >
            Delete
          </Button>
        </TableCell>
      )}
    </TableRow>
  );

  hasActiveRound = () => this.props.rounds.filter((r) => r.active).length > 0;

  getActiveRound = (): Round => this.props.rounds.filter((r) => r.active)[0];

  hasActiveDance = (round: Round): boolean => round.groups
    .reduce((acc, g) => [...acc, ...g.dances], [])
    .filter((d) => d.active).length > 0;

  getFinishedDances = (activeRound: Round) => activeRound.groups
    .reduce((acc, g) => [...acc, ...g.dances], [])
    .filter((d) => d.finished).length;

  getUnfinishedDances = (activeRound: Round) => activeRound.groups
    .reduce((acc, g) => [...acc, ...g.dances], [])
    .filter((d) => !d.finished).length;

  getPastRounds = (): Round[] => this.props.rounds.filter((r) => r.finished);

  getUpcomingRounds = (): Round[] => this.props.rounds.filter(
    (r) => !(r.active || r.finished) && r.id != this.props.nextRound,
  );

  renderActiveRound = () => {
    const activeRound = this.getActiveRound();
    const finishedDances = this.getFinishedDances(activeRound);
    const total = activeRound.danceCount * activeRound.groups.length;
    const percent = (finishedDances / total) * 100 || 0;
    return (
      <Container styleName="pad">
        <Header as="h2">Current Round</Header>
        <Card onClick={() => this.props.onClick(activeRound.id)}>
          <Card.Content>
            <Card.Header>{activeRound.name}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            {this.hasActiveDance(activeRound) ? (
              <Progress percent={percent} success>
                {finishedDances}
                /
                {total}
                {' '}
                dances finished!
              </Progress>
            ) : (
              <Progress percent={percent} warning>
                {finishedDances}
                /
                {total}
                {' '}
                dances finished!
              </Progress>
            )}
          </Card.Content>
        </Card>
      </Container>
    );
  };

  renderUpcomingRounds = () => {
    const upcomingRounds = this.getUpcomingRounds();
    return (
      <Table fixed unstackable basic="very" size="large">
        <Table.Body>{upcomingRounds.map((r) => this.renderItem(r))}</Table.Body>
      </Table>
    );
  };

  renderPastRounds = () => {
    const pastRounds = this.getPastRounds();
    return (
      <Table fixed unstackable basic="very">
        <Table.Body>{pastRounds.map((r) => this.renderItem(r))}</Table.Body>
      </Table>
    );
  };

  renderRounds = () => (
    <Container styleName="pad">
      <Accordion styled>
        <Accordion.Title
          active={this.state.activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Upcoming Rounds
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 0}>
          {this.renderUpcomingRounds()}
        </Accordion.Content>
        <Accordion.Title
          active={this.state.activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Past Rounds
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 1}>
          {this.renderPastRounds()}
        </Accordion.Content>
      </Accordion>
    </Container>
  );

  renderCreateRound = () => (
    <Container styleName="pad">
      <Modal defaultOpen={false} trigger={<Button>Add round</Button>}>
        <Modal.Header>Add round</Modal.Header>
        <Modal.Content>
          <CreateRound tournamentId={this.props.tournamentId} />
        </Modal.Content>
      </Modal>
    </Container>
  );

  hasNextRound = () => this.props.nextRound != null;

  getNextRound = () => this.props.rounds.find((r) => r.id === this.props.nextRound);

  renderNextRound = () => {
    const nextRound = this.getNextRound();
    return (
      <Container styleName="pad">
        <Header as="h2">Next Round</Header>
        {nextRound && (
          <Card>
            <Card.Content>
              <Card.Header onClick={() => this.props.onClick(nextRound.id)}>
                {nextRound.name}
              </Card.Header>
            </Card.Content>
            <Card.Content extra>
              <Button
                basic
                color="green"
                onClick={() => this.props.startRound(nextRound.id)}
              >
                Start Round
              </Button>
              <Button
                basic
                color="red"
                onClick={() => this.props.deleteRound(nextRound.id)}
              >
                Delete
              </Button>
            </Card.Content>
          </Card>
        )}
      </Container>
    );
  };

  render() {
    return (
      <Container>
        {this.hasActiveRound() && this.renderActiveRound()}
        {this.hasNextRound()
          && !this.hasActiveRound()
          && this.renderNextRound()}
        {this.renderCreateRound()}
        {this.renderRounds()}
      </Container>
    );
  }
}

export default RoundList;
