// @flow
import { connect } from 'react-redux';
import RoundNotes from './component';

function mapStateToProps({ tournaments, rounds, participants }: ReduxState) {
  const tournamentRounds: Array<Round> = tournaments.byId[
    tournaments.forJudge
  ].rounds.map(id => rounds.byId[id]);
  const activePairs = getActivePairs(tournamentRounds).map(pair => ({
    // $FlowFixMe
    follower: participants.byId[pair.follower],
    // $FlowFixMe
    leader: participants.byId[pair.leader]
  }));
  const activeRound = getActiveRound(tournamentRounds);
  const criteria = activeRound.criteria;
  return {
    criteria: criteria,
    pairs: activePairs
  };
}

function getActiveRound(tournamentRounds: Array<Round>): Round {
  for (let round of tournamentRounds) {
    if (round.active) return round;
  }
  throw new Error('There is no active round!');
}

function getActivePairs(rounds: Array<Round>): Array<Pair> {
  for (let round of rounds) {
    if (round.active) return getActiveGroup(round).pairs;
  }
  throw new Error('No pairs are currently dancing');
}

function getActiveGroup(round: Round): DanceGroup {
  for (let group of round.groups) {
    if (hasActiveDance(group)) return group;
  }
  throw new Error('There is no active group.');
}

function hasActiveDance(group: DanceGroup): boolean {
  return group.dances.filter(dance => dance.active).length > 0;
}

// $FlowFixMe
const RoundNotesContainer = connect(mapStateToProps)(RoundNotes);
export default RoundNotesContainer;
