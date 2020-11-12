// @flow
import React, { Component } from 'react'
import {
  Container,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Modal,
  Header,
  ModalContent,
  Button,
  ModalActions,
  Icon,
  Search,
  SyntheticEvent,
} from 'semantic-ui-react'

import type { Props } from './types'

type State = {
  isSearchLoading: boolean,
  searchValue: string,
  filterPresent: boolean,
  didClickUnAttend: boolean,
  unAttendParticipant: ?Participant,
}

class ListParticipants extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isSearchLoading: false,
      searchValue: '',
      filterPresent: false,
      didClickUnAttend: false,
      unAttendParticipant: null,
    }
  }

  renderItem = (participant: Participant) => {
    const { id, name, role, isAttending, attendanceId } = participant
    return (
      <TableRow key={id}>
        <Table.Cell collapsing>
          <Checkbox
            slider
            checked={isAttending}
            onChange={() => {
              if (isAttending) {
                this.setState({
                  didClickUnAttend: true,
                  unAttendParticipant: participant,
                })
              } else {
                this.props.onChangeAttending(id, true)
              }
            }}
          />
        </Table.Cell>
        <TableCell>{attendanceId == null ? 'X' : attendanceId}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{this.roleToString(role)}</TableCell>
      </TableRow>
    )
  }

  roleToString(role: ParticipantRole) {
    const { isClassic } = this.props
    if (role === 'leader') {
      if (isClassic) {
        return 'Pair'
      }
      return 'Leader'
    }
    if (role === 'follower') {
      if (isClassic) {
        return 'Dummy'
      }
      return 'Follower'
    }
    if (role === 'leaderAndFollower') {
      return 'Both'
    }
    return 'Invalid role'
  }

  hideModal = () => {
    this.setState({
      didClickUnAttend: false,
      unAttendParticipant: null,
    })
  }

  handleFilterChange = (e: SyntheticEvent<HTMLInputElement>, data: { checked: boolean }) => {
    const { checked } = data
    this.setState({ filterPresent: checked })
  }

  renderUnattendModal = () => (
    <Modal open={this.state.didClickUnAttend} onClose={this.hideModal}>
      <Header content="Un-attending participant" />
      <ModalContent>
        <p>
          Marking{' '}
          <b>
            {this.state.unAttendParticipant == null
              ? 'someone'
              : `${this.state.unAttendParticipant.name} (${this.state.unAttendParticipant.attendanceId})`}{' '}
          </b>
          as not-present
        </p>
      </ModalContent>
      <ModalActions>
        <Button
          color="green"
          inverted
          onClick={() => {
            if (this.state.unAttendParticipant) {
              this.props.onChangeAttending(this.state.unAttendParticipant.id, false)
            }
            this.hideModal()
          }}>
          <Icon name="checkmark" /> OK
        </Button>
        <Button color="red" onClick={this.hideModal}>
          <Icon name="remove" /> No
        </Button>
      </ModalActions>
    </Modal>
  )

  handleSearchChange = (e: SyntheticEvent<HTMLInputElement>, { value }: { value: string }) => {
    this.setState({ isSearchLoading: true, searchValue: value })
    this.setState({ isSearchLoading: false })
  }

  getNotPresent = (): Participant[] => this.props.participants.filter((p) => !p.isAttending)

  searchParticipants = (participants: Array<Participant>): Participant[] =>
    participants.filter((p) => {
      const name = p.name.toLowerCase()
      const search = this.state.searchValue.toLowerCase()
      return name.indexOf(search) !== -1
    })

  render() {
    let participants = this.state.filterPresent ? this.getNotPresent() : this.props.participants
    participants = this.searchParticipants(participants)
    return (
      <Container>
        {this.renderUnattendModal()}
        <Table basic="very">
          <TableBody>
            <TableRow>
              <TableCell>
                <Search
                  loading={this.state.isSearchLoading}
                  onSearchChange={this.handleSearchChange}
                  value={this.state.searchValue}
                  showNoResults={false}
                />
              </TableCell>
              <TableCell textAlign="right">
                <Checkbox
                  toggle
                  checked={this.state.filterPresent}
                  onChange={this.handleFilterChange}
                />
              </TableCell>
              <TableCell textAlign="left">
                <b>Show only NOT present</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table selectable basic="very">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Present</TableHeaderCell>
              <TableHeaderCell collapsing>Participant Number</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>{participants.map(this.renderItem)}</TableBody>
        </Table>
      </Container>
    )
  }
}

export default ListParticipants
