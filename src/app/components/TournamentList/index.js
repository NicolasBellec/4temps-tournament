// @flow

import React, { Component } from 'react'
import { Header, Container, Loader, Table, TableRow, TableCell, TableBody } from 'semantic-ui-react'
import moment from 'moment'
import type Moment from 'moment'

import './styles.css'

import type { Props, State } from './types'

function sortTournaments(tournaments: Array<Tournament>) {
  // sort by latest date first
  return tournaments.sort((a: Tournament, b: Tournament) =>
    a.date.isSameOrBefore(b.date) ? 1 : -1
  )
}

function getPreviousTournaments(tournaments: Array<Tournament>): Tournament[] {
  const now = moment()
  return sortTournaments(tournaments).filter((tour) => tour.date.isSameOrBefore(now))
}

function getFutureTournaments(tournaments: Array<Tournament>): Tournament[] {
  const now = moment()
  return sortTournaments(tournaments).filter((tour) => tour.date.isSameOrAfter(now))
}

class TournamentList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const { tournaments } = this.props
    this.state = {
      previousTournaments: getPreviousTournaments(tournaments),
      futureTournaments: getFutureTournaments(tournaments),
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const previousTournaments = getPreviousTournaments(props.tournaments)
    const futureTournaments = getFutureTournaments(props.tournaments)

    return {
      previousTournaments,
      futureTournaments
    }
  }

  // componentWillReceiveProps(nextProps: Props) {
  //   const previousTournaments = getPreviousTournaments(nextProps.tournaments)
  //   const futureTournaments = getFutureTournaments(nextProps.tournaments)
  //
  //   this.setState({ previousTournaments, futureTournaments })
  // }

  renderHeaderAndTournaments = (header: string, tournaments: Tournament[]) => {
    if (this.shouldRenderTable(tournaments)) {
      return (
        <div styleName="wrapper">
          <Header as="h2">{header}</Header>
          {this.renderTable(tournaments)}
        </div>
      )
    }

    return null
  }

  renderTable = (tournaments: Tournament[]) => (
    <Table selectable textAlign="center" fixed>
      <TableBody>{tournaments.map(this.renderRow)}</TableBody>
    </Table>
  )

  shouldRenderTable = (tournaments: Tournament[]) => tournaments.length > 0

  renderRow = ({ id, name, date, type }: Tournament) => {
    const { onClick } = this.props
    return (
      <TableRow key={id} onClick={onClick != null ? () => onClick(id) : null}>
        <TableCell>{name}</TableCell>
        <TableCell>{this.typeToName(type)}</TableCell>
        <TableCell>{this.formatDate(date)}</TableCell>
      </TableRow>
    )
  }

  typeToName = (type: TournamentType): string => {
    if (type === 'jj') {
      return "Jack n' Jill"
    }
    if (type === 'classic') {
      return 'Classic'
    }
    return 'Unknown'
  }

  formatDate = (singleMoment: Moment) => singleMoment.format('LL')

  /*
    TODO: Should be placed in a PreloadContainer
  */
  render() {
    const { isLoading } = this.props
    const { futureTournaments, previousTournaments } = this.state
    return (
      <Container text>
        {isLoading && <Loader active={isLoading} />}
        {this.renderHeaderAndTournaments('Upcoming', futureTournaments)}
        {this.renderHeaderAndTournaments('Past', previousTournaments)}
      </Container>
    )
  }
}

export default TournamentList
