// @flow

import { connect } from 'react-redux'
import PreloadContainer from '../../../../containers/PreloadContainer'
import Component from './component'

import { getAccessKeysForTournament } from '../../../../api/access-key'
import { getAdminTournamentsAction } from '../../../../action-creators/tournament'
import { getAccessKeysAction } from '../../../../action-creators/access-key'

import type { OwnProps, StateProps, DispatchProps, Props } from './types'

function mapStateToProps(
  { assistants, accessKeys }: ReduxState,
  { tournamentId }: OwnProps
): StateProps {
  const hasTournament = assistants.forTournament[tournamentId] != null
  const hasKeys =
    hasTournament &&
    assistants.forTournament[tournamentId].reduce(
      (acc, curr) => acc && accessKeys[curr] != null,
      true
    )
  return {
    child: Component,
    shouldLoad: !hasKeys,
    assistants: (assistants.forTournament[tournamentId] || []).map((id) => ({
      ...assistants.byId[id],
      accessKey: accessKeys[id],
    })),
  }
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: OwnProps): DispatchProps {
  return {
    load: () => {
      dispatch(getAdminTournamentsAction())
      dispatch(getAccessKeysAction(tournamentId))
    },
  }
}

const connector = connect<Props, OwnProps, StateProps, _, _, _>(mapStateToProps, mapDispatchToProps)

const ListAssistantsContainer = connector(PreloadContainer)
export default ListAssistantsContainer
