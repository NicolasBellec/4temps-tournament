// no-flow
import { connect } from 'react-redux';

import AssistantView from './component';
import {
  StateProps,
} from './types';

function mapStateToProps({ user }: ReduxState): StateProps {
  return {
    tournamentId: user.tournamentId,
  };
}

export default connect(mapStateToProps)(AssistantView);
