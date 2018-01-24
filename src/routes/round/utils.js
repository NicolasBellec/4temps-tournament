// @flow

function parseRound(bodyRound: mixed): Round {
  let round: Round = {
    _id: '',
    name: '',
    danceCount: null,
    minPairCount: null,
    maxPairCount: null,
    tieRule: 'none',
    roundScoringRule: 'none',
    multipleDanceScoringRule: 'none',
    criteria: [],
  };

  if (typeof bodyRound === 'object' && bodyRound != null) {
    for (const key in bodyRound) {
      if (key in round && bodyRound[key] != undefined) {
        round[key] = bodyRound[key];
      }
    }
  }
  return round;
}

export default parseRound;