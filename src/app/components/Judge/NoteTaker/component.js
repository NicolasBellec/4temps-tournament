// @flow

import React from 'react';

import PairNoteTaker from './PairNoteTaker';
import SeparateNoteTaker from './SeparateNoteTaker';

import type { Props } from './types';

// TODO: Here is the change for removing classic last round
function NoteTaker({ isLastRound, isClassic }: Props) {
  return isLastRound || isClassic ? <PairNoteTaker /> : <SeparateNoteTaker />;
}

export default NoteTaker;
