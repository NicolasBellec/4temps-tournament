// @flow
import React from 'react';
import {
  Grid, GridColumn, GridRow, Header,
} from 'semantic-ui-react';
import NoteCriterion from '../NoteCriterion';

import type {
  Props
} from './types';

function PairNoteTaker({
  leaderId,
  followerId,
  leaderCriteria,
  followerCriteria,
  onClick,
  tournamentId,
  judgeId,
  danceId,
}: Props) {
  return (
    <Grid columns={2}>
      <GridColumn>
        <GridRow>
          <Header as="h2">Leader</Header>
        </GridRow>
        <GridRow>
          {leaderCriteria.map((criterion) => (
            <NoteCriterion
              key={leaderId + criterion.id}
              notedEntity={leaderId}
              onClick={(value: ?number) => onClick(tournamentId, {
                danceId,
                judgeId,
                participantId: leaderId,
                criterionId: criterion.id,
                value,
              })}
              criterion={criterion}
            />
          ))}
        </GridRow>
      </GridColumn>
      <GridColumn>
        <GridRow>
          <Header as="h2">Follower</Header>
        </GridRow>
        <GridRow>
          {followerCriteria.map((criterion) => (
            <NoteCriterion
              key={followerId + criterion.id}
              notedEntity={followerId}
              onClick={(value: ?number) => onClick(tournamentId, {
                danceId,
                judgeId,
                participantId: followerId,
                criterionId: criterion.id,
                value,
              })}
              criterion={criterion}
            />
          ))}
        </GridRow>
      </GridColumn>
    </Grid>
  );
}

export default PairNoteTaker;
