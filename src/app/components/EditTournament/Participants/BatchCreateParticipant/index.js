// @flow
import { connect } from 'react-redux'

import BatchCreateParticipant from './component'
import {
  getBatchCreateParticipantAction
} from '../../../../action-creators/participant'

import type { OwnProps, StateProps, DispatchProps, Props, ComponentState } from './types'

function mapStateToProps({ tournaments, ui }: ReduxState, { tournamentId }: OwnProps): StateProps {
  return {
    ...ui.batchCreateParticipant,
    isClassic:
      tournaments.byId[tournamentId] != null && tournaments.byId[tournamentId].type === 'classic',
  }
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: OwnProps): DispatchProps {
  return {
    onSubmit: ({ csv }: ComponentState) => {
      dispatch(getBatchCreateParticipantAction(tournamentId, csv));
    },
  }
}

const BatchCreateParticipantContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(BatchCreateParticipant)

export default BatchCreateParticipantContainer
