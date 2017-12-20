// @flow

import moment from 'moment';
import type { Tournament } from '../../models/tournament';

import validateTournament from '../validate-tournament';

test('Valid tournament is valid', () => {
  const tournament: Tournament = {
    name: '4temps World Championship',
    date: moment(),
    type: 'jj'
  };
  const validation = validateTournament(tournament);

  expect(validation.isValidTournament).toBe(true);
  expect(validation.isValidDate).toBe(true);
  expect(validation.isValidName).toBe(true);
  expect(validation.isValidType).toBe(true);
});

test('Empty name is invalid', () => {
  const tournament: Tournament = {
    name: '',
    date: moment(),
    type: 'jj'
  };
  const validation = validateTournament(tournament);

  expect(validation.isValidTournament).toBe(false);
  expect(validation.isValidName).toBe(false);

  expect(validation.isValidType).toBe(true);
});

describe('Tournament type must be valid', () => {
  test('Tournament type must be set', () => {
    const tournament: Tournament = {
      name: 'World championship',
      date: moment(),
      type: 'none'
    };
    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(false);
    expect(validation.isValidType).toBe(false);
  });

  test('Tournament type may be jj', () => {
    const tournament: Tournament = {
      name: 'World championship',
      date: moment(),
      type: 'jj'
    };
    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(true);
    expect(validation.isValidType).toBe(true);
  });

  test('Tournament type may be classic', () => {
    const tournament: Tournament = {
      name: 'World championship',
      date: moment(),
      type: 'classic'
    };
    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(true);
    expect(validation.isValidType).toBe(true);
  });

  test('Tournament type must adhere to union type', () => {
    const tournament: Tournament = {
      name: 'World championship',
      date: moment(),
      // $FlowFixMe (ignored on purpose)
      type: 'some other type'
    };
    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(false);
    expect(validation.isValidType).toBe(false);
  });
});

test('Unix epoch is invalid date', () => {
  const tournament: Tournament = {
    name: 'World championship',
    date: moment(0),
    type: 'classic'
  };
  const validation = validateTournament(tournament);

  expect(validation.isValidTournament).toBe(false);
  expect(validation.isValidDate).toBe(false);
});