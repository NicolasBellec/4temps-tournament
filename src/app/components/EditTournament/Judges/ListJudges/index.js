// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import Component from './component';

import { getAccessKeysForTournament } from '../../../../api/access-key';
import { getAdminTournamentsAction } from '../../../../action-creators/tournament';
import { getAccessKeysAction } from '../../../../action-creators/access-key';

import type {
  Props,
  StateProps,
  DispatchProps,
  OwnProps,
} from "./types";

function mapStateToProps(
  { judges, accessKeys }: ReduxState,
  { tournamentId }: OwnProps,
): StateProps {
  const hasTournament = judges.forTournament[tournamentId] != null;
  const hasKeys = hasTournament
    && judges.forTournament[tournamentId].reduce(
      (acc, curr) => acc && accessKeys[curr] != null,
      true,
    );
  return {
    child: Component,
    shouldLoad: !hasKeys,
    judges: (judges.forTournament[tournamentId] || []).map((id) => ({
      data: judges.byId[id],
      accessKey: accessKeys[id],
    })),
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: OwnProps
): DispatchProps {
  return {
    load: () => {
      dispatch(getAdminTournamentsAction());
      dispatch(getAccessKeysAction(tournamentId));
    },
  };
}

const ListJudgesContainer = connect<Props, OwnProps, StateProps, _,_,_>(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default ListJudgesContainer;
