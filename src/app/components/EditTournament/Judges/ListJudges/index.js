// no-flow

import { connect } from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import Component from './component';

import { getAccessKeysForTournament } from '../../../../api/access-key';
import { getAdminTournamentsAction } from '../../../../action-creators/tournament';
import { getAccessKeysAction } from '../../../../action-creators/access-key';

type Props = {
  tournamentId: string,
};

function mapStateToProps(
  { judges, accessKeys }: ReduxState,
  { tournamentId }: Props,
) {
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
      ...judges.byId[id],
      accessKey: accessKeys[id],
    })),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: () => {
      dispatch(getAdminTournamentsAction());
      dispatch(getAccessKeysAction(tournamentId));
    },
  };
}

const ListJudgesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default ListJudgesContainer;
