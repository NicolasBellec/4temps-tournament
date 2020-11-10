// no-flow
import { connect } from 'react-redux';
import Judge from './component';
import type { Props as JudgeComponentProps } from './component';
import PreloadContainer from '../PreloadContainer';
import { getJudgeTournamentAction } from '../../action-creators/tournament';

function mapStateToProps(state: ReduxState): JudgeComponentProps {
  const { tournaments, rounds, user } = state;
  const activeRound = tournaments.forJudge !== ''
    ? getActiveRound(
      rounds.forTournament[tournaments.forJudge].map(
        (id) => rounds.byId[id],
      ),
    )
    : null;

  const activeDanceId = activeRound != null ? getActiveDanceId(activeRound) : null;
  return {
    child: Judge,
    shouldLoad: tournaments.forJudge === '',
    tournamentId: tournaments.forJudge,
    activeDanceId,
    activeRound,
    notesSubmitted:
      tournaments.forJudge === ''
        ? false
        : isNotesSubmittedForDance(state, activeDanceId),
    judgeId: user.id,
  };
}

function isNotesSubmittedForDance(
  { user, tournaments }: ReduxState,
  danceId: ?string,
) {
  const tournament = tournaments.byId[tournaments.forJudge];
  if (tournament.dancesNoted && tournament.dancesNoted[user.id]) {
    return tournament.dancesNoted[user.id].includes(danceId);
  }
  return false;
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    load: () => dispatch(getJudgeTournamentAction()),
  };
}

function getActiveDanceId(round: Round): string {
  return round.groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active);
    if (dance) {
      return dance.id;
    }
    return res;
  }, '');
}

function getActiveRound(rounds: Array<Round>): ?Round {
  return rounds.reduce((acc, round) => {
    if (round.active) {
      return round;
    }
    return acc;
  }, null);
}

const JudgeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default JudgeContainer;
