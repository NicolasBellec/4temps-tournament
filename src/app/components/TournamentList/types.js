// @flow

export type Props = {
  isLoading: boolean,
  tournaments: Array<Tournament>,
  onClick: ?(tournamentId: string) => void,
}

export type State = {
  previousTournaments: Array<Tournament>,
  futureTournaments: Array<Tournament>,
}
