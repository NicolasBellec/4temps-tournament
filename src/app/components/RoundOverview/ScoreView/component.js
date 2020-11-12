// @flow

import React from 'react';
import {
  Divider,
  Segment,
  Header,
  Grid,
  GridRow,
  GridColumn,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableBody,
} from 'semantic-ui-react';
import type {
  StateProps,
  Props,
  OwnProps,
  ScoreViewTableProps,
  ScoreViewModel,
} from './types';

export default function ScoreView({ isFinished, ...rest }: Props) {
  if (!isFinished) {
    return <NotFinished />;
  }

  return (
    <ScoreTables
      winningLeaderScores={rest.winningLeaderScores}
      winningFollowerScores={rest.winningFollowerScores}
      losingLeaderScores={rest.losingLeaderScores}
      losingFollowerScores={rest.losingFollowerScores}
    />
  );
}

function ScoreTables({
  winningLeaderScores,
  winningFollowerScores,
  losingLeaderScores,
  losingFollowerScores,
}: ScoreViewTableProps) {
  return (
    <Grid stackable>
      <GridRow>
        <Header as="h2">Winners</Header>
      </GridRow>
      <GridRow columns="2">
        <GridColumn>
          <Header as="h3">Leaders</Header>
          <ScoreTable scores={winningLeaderScores} />
        </GridColumn>
        <GridColumn>
          <Header as="h3">Followers</Header>
          <ScoreTable scores={winningFollowerScores} />
        </GridColumn>
      </GridRow>
      <GridRow>
        <Divider />
        <Header as="h2">Participants that did not pass</Header>
      </GridRow>
      <GridRow columns="2">
        <GridColumn>
          <Header as="h3">Leaders</Header>
          <ScoreTable scores={losingLeaderScores} />
        </GridColumn>
        <GridColumn>
          <Header as="h3">Followers</Header>
          <ScoreTable scores={losingFollowerScores} />
        </GridColumn>
      </GridRow>
    </Grid>
  );
}

function ScoreTableRow(score: ScoreViewModel) {
  return (
    <TableRow key={score.participant.id}>
      <TableCell>{score.position}</TableCell>
      <TableCell>{score.score}</TableCell>
      <TableCell>{score.participant.attendanceId}</TableCell>
      <TableCell>{score.participant.name}</TableCell>
    </TableRow>
  );
}

function ScoreTable({ scores }: { scores: Array<ScoreViewModel> }) {
  return (
    <Table unstackable>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Position</TableHeaderCell>
          <TableHeaderCell>Score</TableHeaderCell>
          <TableHeaderCell>Participant ID</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>{scores.map(ScoreTableRow)}</TableBody>
    </Table>
  );
}

function NotFinished() {
  return (
    <Segment basic textAlign="center" vertical>
      <Header as="h2">Scores will be shown once the round is done</Header>
    </Segment>
  );
}
