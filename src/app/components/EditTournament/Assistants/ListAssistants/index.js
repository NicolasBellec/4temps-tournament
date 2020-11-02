// no-flow

import { connect } from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import Component from './component';

import { getAccessKeysForTournament } from '../../../../api/access-key';
import { getAdminTournamentsAction } from '../../../../action-creators/tournament';

type Props = {
  tournamentId: string,
};

function mapStateToProps(
  { assistants, accessKeys }: ReduxState,
  { tournamentId }: Props,
) {
  const hasTournament = assistants.forTournament[tournamentId] != null;
  const hasKeys = hasTournament
    && assistants.forTournament[tournamentId].reduce(
      (acc, curr) => acc && accessKeys[curr] != null,
      true,
    );
  return {
    Child: Component,
    shouldLoad: !hasKeys,
    assistants: (assistants.forTournament[tournamentId] || []).map((id) => ({
      ...assistants.byId[id],
      accessKey: accessKeys[id],
    })),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: () => {
      dispatch(getAdminTournamentsAction);
      dispatch({
        type: 'GET_ACCESS_KEYS',
        promise: getAccessKeysForTournament(tournamentId),
      });
    },
  };
}

const ListAssistantsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default ListAssistantsContainer;
