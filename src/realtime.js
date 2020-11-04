// @flow
import IO from 'socket.io';
import type { SocketIO } from 'socket.io';

// $FlowFixMe[value-as-type]
let io: SocketIO;

export function setup(server: mixed) {
  io = IO(server);
  io.on('connection', onConnection);
}

// $FlowFixMe[value-as-type]
function onConnection(socket: SocketIO) {
  socket.on('subscribe', (room) => {
    socket.join(room);
  });
}

export function pushTournamentUpdate(tournament: Tournament) {
  io.to(`tournament/${tournament.id}`).emit('tournament update', tournament);
}

export function pushLeaderboardUpdate(leaderboard: Leaderboard) {
  io.to(`leaderboard/${leaderboard.tournamentId}`).emit(
    'leaderboard update',
    leaderboard,
  );
}
