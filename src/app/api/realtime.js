// @flow

import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { normalizeTournament } from '../reducers/normalize'
import { deserializeTournament } from './tournament'
import { getTournamentUpdatedAction } from '../action-creators/realtime'
import { getLeaderboardUpdateAction } from '../action-creators/leaderboard'

let socket: Socket

export function setup(dispatch: ReduxDispatch): void {
  socket = io()
  socket.on('tournament update', (tournament) => {
    const normalized = normalizeTournament(deserializeTournament(tournament))
    dispatch(getTournamentUpdatedAction(normalized))
  })
  socket.on('leaderboard update', (leaderboard) => {
    dispatch(getLeaderboardUpdateAction(leaderboard))
  })
}

export function subscribeToUpdatesForTournaments(ids: Array<string>): void {
  ids.forEach((id) => socket.emit('subscribe', `tournament/${id}`))
}

export function subscribeToLeaderboardForTournament(id: string): void {
  socket.emit('subscribe', `leaderboard/${id}`)
}
