// no-flow

import React, { Fragment } from 'react';

import {
  Grid,
  GridRow,
  GridColumn,
  Header,
} from 'semantic-ui-react';
import type {
  Props,
} from './types';

import './styles.css';

export default function Groups({ hasActiveRound, roundName, groups }: Props) {
  if (!hasActiveRound) {
    return <Header>Active round to generate groups</Header>;
  }

  return (
    <>
      <Header as="h1" textAlign="center">
        {roundName}
      </Header>
      {groups.map((group) => (
        <div styleName="group" key={group.number}>
          <Header as="h2">
            Group
            {group.number}
          </Header>
          <Grid>
            <GridRow columns={group.pairs.length}>
              {group.pairs.map((couple, i) => (i % 2 === 0 ? (
                <GridColumn styleName="column" key={`upper-${couple}`} />
              ) : (
                <GridColumn styleName="column" key={`upper-${couple}`}>
                  {couple}
                </GridColumn>
              )))}
            </GridRow>
            <GridRow columns={group.pairs.length}>
              {group.pairs.map((couple, i) => (i % 2 !== 0 ? (
                <GridColumn styleName="column" key={`lower-${couple}`} />
              ) : (
                <GridColumn styleName="column" key={`lower-${couple}`}>
                  {couple}
                </GridColumn>
              )))}
            </GridRow>
          </Grid>
        </div>
      ))}
    </>
  );
}
