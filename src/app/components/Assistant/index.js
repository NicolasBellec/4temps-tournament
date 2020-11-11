// @flow
import { connect } from 'react-redux';

import AssistantView from './component';
import type {
  StateProps,
  Props
} from './types';

function mapStateToProps({ user }: ReduxState): StateProps {
  return {
    tournamentId: user.tournamentId,
  };
}

export default connect<Props, {}, StateProps, _,_,_>(
  mapStateToProps
)(AssistantView);
