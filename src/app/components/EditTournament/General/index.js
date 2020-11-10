// @flow
import { connect } from 'react-redux';
// $FlowFixMe
import { updateTournament } from '../../../api/tournament';

import {
  // $FlowFixMe
  getAdminTournamentsAction,
  // $FlowFixMe
  getEditTournamentAction,
} from '../../../action-creators/tournament';

import EditTournamentGeneral from './component';
import PreloadContainer from '../../PreloadContainer';

import type {
  Props,
  StateProps,
  DispatchProps,
  OwnProps,
  TournamentRepresentation
} from "./types";

function mapStateToProps(
  {
    tournaments, rounds, judges, participants, ui,
  }: ReduxState,
  { tournamentId }: OwnProps,
): StateProps {
  return {
    ...ui.editTournament,
    tournament: {
      data: tournaments.byId[tournamentId],
      rounds: (rounds.forTournament[tournamentId] || []).map(
        (id) => rounds.byId[id],
      ),
      judges: (judges.forTournament[tournamentId] || []).map(
        (id) => judges.byId[id],
      ),
      participants: (participants.forTournament[tournamentId] || []).map(
        (id) => participants.byId[id],
      ),
    },

    shouldLoad: !tournaments.byId[tournamentId],
    child: EditTournamentGeneral,
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, history }: OwnProps,
): DispatchProps {
  return {
    onSubmit: (tournament: TournamentRepresentation) => {
      dispatch(getEditTournamentAction(tournamentId, tournament))
    },
    onClickLeaderboard: () => {
      history.push(`/leaderboard/${tournamentId}`)
    },
    load: () => {
      dispatch(getAdminTournamentsAction())
    },
  };
}

const EditTournamentGeneralConnectedContainer =
  connect<Props, OwnProps, StateProps, _,_,_>(
    mapStateToProps,
    mapDispatchToProps,
)(PreloadContainer);

export default EditTournamentGeneralConnectedContainer;
