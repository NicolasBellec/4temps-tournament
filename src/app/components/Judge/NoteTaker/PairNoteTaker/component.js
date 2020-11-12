// @flow
import React from 'react';
import { Grid, GridRow, Header } from 'semantic-ui-react';
import NoteCriterion from '../NoteCriterion';

import type { Props, CriterionViewModel } from './types';

function PairNoteTaker({
  pairId,
  criteria,
  onClick,
  tournamentId,
  judgeId,
  danceId,
}: Props) {
  return (
    <Grid centered>
      <GridRow>
        <Header as="h2">Couple</Header>
      </GridRow>
      {criteria.map((criterion) => (
        <GridRow key={pairId + criterion.id}>
          <NoteCriterion
            notedEntity={pairId}
            onClick={(value: ?number) => onClick(tournamentId, {
              danceId,
              judgeId,
              participantId: pairId,
              criterionId: criterion.id,
              // $FlowFixMe
              value,
            })}
            criterion={criterion}
          />
        </GridRow>
      ))}
    </Grid>
  );
}

export default PairNoteTaker;
