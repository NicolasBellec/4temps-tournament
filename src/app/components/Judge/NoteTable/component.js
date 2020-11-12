// @flow

import React, { PureComponent } from 'react'
import {
  Header,
  Table,
  TableRow,
  TableHeader,
  TableBody,
  TableHeaderCell,
  TableCell,
  Grid,
  Container,
} from 'semantic-ui-react'

import type { Props, ColumnViewModel, ScoreViewModel } from './types'

class NoteTable extends PureComponent<Props> {
  createTable = (column: ColumnViewModel) => (
    <Container>
      <Header as="h3">{column.title}</Header>
      <Table unstackable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Position</TableHeaderCell>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Score</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {column.danceScores.map((score, i) => (
            <TableRow key={score.name}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{score.name}</TableCell>
              <TableCell>{score.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )

  render() {
    return (
      <Grid columns={this.props.columns.length} stackable>
        {this.props.columns.map((col) => (
          <Grid.Column key={col.title}>{this.createTable(col)}</Grid.Column>
        ))}
      </Grid>
    )
  }
}

export default NoteTable
