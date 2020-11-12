// @flow

import { connect } from 'react-redux';
import type {
  StateProps,
  DispatchProps,
  Props
} from './types';
import Component from './component';
// $FlowFixMe
import NoteChecker from '../../../../domain/note-checker';
import { getSubmitNotesAction } from '../../../action-creators/note';

function mapStateToProps(state: ReduxState): StateProps {
  const tournament = getTournament(state);
  const danceId = getActiveDanceId(getActiveRound(state));
  const notes = getNotesForActiveDance(state, danceId);
  const uiNotes = state.ui.notes;

  return {
    ...uiNotes,
    tournamentId: state.tournaments.forJudge,
    notes,
    hasAllNotes: hasAllNotes(tournament, danceId, notes, state.user.id),
  };
}

function hasAllNotes(
  tournament: Tournament,
  danceId: string,
  notes: Array<JudgeNote>,
  judgeId: string,
) {
  const noteChecker = new NoteChecker(tournament);
  return noteChecker.allSetForDanceByJudge(danceId, notes, judgeId);
}

function getNotesForActiveDance(
  state: ReduxState,
  activeDanceId: string,
): Array<JudgeNote> {
  return Object.keys(state.notes.byParticipant)
    .reduce(
      (notes, participantId) => [
        ...notes,
        ...Object.keys(state.notes.byParticipant[participantId]).reduce(
          (acc, critId) => [
            ...acc,
            state.notes.byParticipant[participantId][critId],
          ],
          [],
        ),
      ],
      [],
    )
    .filter(({ danceId }) => danceId === activeDanceId);
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

function getActiveRound(state: ReduxState): Round {
  const tournament = getTournament(state);
  return tournament.rounds.filter((r) => r.active)[0];
}

function getTournament(state: ReduxState): Tournament {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  return {
    ...tournament,
    rounds: tournament.rounds.map((id) => state.rounds.byId[id]),
    judges: tournament.judges.map((id) => state.judges.byId[id]),
    assistants: tournament.assistants.map((id) => state.assistants.byId[id]),
    participants: tournament.participants.map((id) => state.participants.byId[id]),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    onSubmit: (tournamentId: string, notes: Array<JudgeNote>) => {
      dispatch(getSubmitNotesAction(tournamentId, notes));
    },
  };
}

const SubmitNotesModalContainer = connect<Props, {}, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default SubmitNotesModalContainer;
