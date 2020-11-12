// @flow

import { connect } from 'react-redux'
import Component from './component'
import createAssistantAction from '../../../../action-creators/assistant'

import type { OwnProps, StateProps, DispatchProps, Props } from './types'

function mapStateToProps({ ui }: ReduxState): StateProps {
  return ui.createAssistant
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: OwnProps): DispatchProps {
  return {
    onSubmit: (name: string) => {
      dispatch(createAssistantAction(tournamentId, name))
    },
  }
}

const CreateAssistantContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(Component)

export default CreateAssistantContainer
