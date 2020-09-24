// @flow
import type {
  JudgeWeightedNote,
  JudgeScore,
  JudgeRank,
  RankMatrix,
  RankMatrixRow
} from '../rpss-round-scorer';

import RPSSRoundScorer from '../rpss-round-scorer';
import {
  createLeader,
  createFollower,
  createJudge,
  generateId,
  createRound
} from '../../test-utils';

/*
  Missing tests :
    - what happens when notes of the judgePresident are enable
    - what happens when we have a strictly competition (pair.follower === null)
*/

describe('RPSS Round scorer', () => {
  const leaders: Array<Participant> = generateLeaders(4);
  const followers: Participant[] = generateFollowers(4);
  const participants: Participant[] = [...leaders, ...followers];
  const judges: Judge[] = generateJudges(4);
  const judgeSanction: Judge = {
    ...createJudge(),
    judgeType: 'sanctioner'
  };
  const judgePresident: Judge = {
    ...createJudge(),
    judgeType: 'president'
  };
  const judgesWithSanctionner: Judge[] = [...judges, judgeSanction];
  const dances = [
    genDance(generateId()),
    genDance(generateId()),
    genDance(generateId()),
    genDance(generateId())
  ];
  const criteria: RoundCriterion[] = [
    genCriteria(0, 10, 'normal'),
    genCriteria(0, 19, 'normal'),
    genCriteria(0, 11, 'normal')
  ];
  const penaltyCriterion: RoundCriterion = genCriteria(0, 100, 'sanctioner');
  const criteriaWithPenalty: RoundCriterion[] = [...criteria, penaltyCriterion];

  const fullScaleScores: Array<JudgeNote> = [
    // Dance 0, leader 0
    ...genFullDanceJudgeNote(judges[0], leaders[0], dances[0], criteria, [
      0,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[0], dances[0], criteria, [
      1,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[0], dances[0], criteria, [
      2,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[0], dances[0], criteria, [
      3,
      0,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[0], dances[0], penaltyCriterion, 0),
    // Dance 1, leader 0
    ...genFullDanceJudgeNote(judges[0], leaders[0], dances[1], criteria, [
      2,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[0], dances[1], criteria, [
      3,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[0], dances[1], criteria, [
      4,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[0], dances[1], criteria, [
      5,
      0,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[0], dances[1], penaltyCriterion, 2),
    // Dance 0, leader 1
    ...genFullDanceJudgeNote(judges[0], leaders[1], dances[0], criteria, [
      4,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[1], dances[0], criteria, [
      5,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[1], dances[0], criteria, [
      6,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[1], dances[0], criteria, [
      7,
      0,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[1], dances[0], penaltyCriterion, 1),
    // Dance 1, leader 1
    ...genFullDanceJudgeNote(judges[0], leaders[1], dances[1], criteria, [
      6,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[1], dances[1], criteria, [
      7,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[1], dances[1], criteria, [
      8,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[1], dances[1], criteria, [
      9,
      0,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[1], dances[1], penaltyCriterion, 3),
    // Dance 2, leader 2
    ...genFullDanceJudgeNote(judges[0], leaders[2], dances[2], criteria, [
      8,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[2], dances[2], criteria, [
      9,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[2], dances[2], criteria, [
      10,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[2], dances[2], criteria, [
      10,
      1,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[2], dances[2], penaltyCriterion, 2),
    // Dance 3, leader 2
    ...genFullDanceJudgeNote(judges[0], leaders[2], dances[3], criteria, [
      10,
      0,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[2], dances[3], criteria, [
      10,
      1,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[2], dances[3], criteria, [
      10,
      2,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[2], dances[3], criteria, [
      10,
      3,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[2], dances[3], penaltyCriterion, 4),
    // Dance 2, leader 3
    ...genFullDanceJudgeNote(judges[0], leaders[3], dances[2], criteria, [
      10,
      2,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[3], dances[2], criteria, [
      10,
      3,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[3], dances[2], criteria, [
      10,
      4,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[3], dances[2], criteria, [
      10,
      5,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[3], dances[2], penaltyCriterion, 3),
    // Dance 3, leader 3
    ...genFullDanceJudgeNote(judges[0], leaders[3], dances[3], criteria, [
      10,
      4,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], leaders[3], dances[3], criteria, [
      10,
      5,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], leaders[3], dances[3], criteria, [
      10,
      6,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], leaders[3], dances[3], criteria, [
      10,
      7,
      0
    ]),
    genJudgeNote(judgeSanction, leaders[3], dances[3], penaltyCriterion, 5),
    // Dance 0, follower 0
    ...genFullDanceJudgeNote(judges[0], followers[0], dances[0], criteria, [
      10,
      6,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[0], dances[0], criteria, [
      10,
      7,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[0], dances[0], criteria, [
      10,
      8,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[0], dances[0], criteria, [
      10,
      9,
      0
    ]),
    genJudgeNote(judgeSanction, followers[0], dances[0], penaltyCriterion, 4),
    // Dance 1, follower 0
    ...genFullDanceJudgeNote(judges[0], followers[0], dances[1], criteria, [
      10,
      8,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[0], dances[1], criteria, [
      10,
      9,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[0], dances[1], criteria, [
      10,
      10,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[0], dances[1], criteria, [
      10,
      11,
      0
    ]),
    genJudgeNote(judgeSanction, followers[0], dances[1], penaltyCriterion, 6),
    // Dance 0, follower 1
    ...genFullDanceJudgeNote(judges[0], followers[1], dances[0], criteria, [
      10,
      10,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[1], dances[0], criteria, [
      10,
      11,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[1], dances[0], criteria, [
      10,
      12,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[1], dances[0], criteria, [
      10,
      13,
      0
    ]),
    genJudgeNote(judgeSanction, followers[1], dances[0], penaltyCriterion, 5),
    // Dance 1, follower 1
    ...genFullDanceJudgeNote(judges[0], followers[1], dances[1], criteria, [
      10,
      12,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[1], dances[1], criteria, [
      10,
      13,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[1], dances[1], criteria, [
      10,
      14,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[1], dances[1], criteria, [
      10,
      15,
      0
    ]),
    genJudgeNote(judgeSanction, followers[1], dances[1], penaltyCriterion, 7),
    // Dance 2, follower 2
    ...genFullDanceJudgeNote(judges[0], followers[2], dances[2], criteria, [
      10,
      14,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[2], dances[2], criteria, [
      10,
      15,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[2], dances[2], criteria, [
      10,
      16,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[2], dances[2], criteria, [
      10,
      17,
      0
    ]),
    genJudgeNote(judgeSanction, followers[2], dances[2], penaltyCriterion, 6),
    // Dance 3, follower 2
    ...genFullDanceJudgeNote(judges[0], followers[2], dances[3], criteria, [
      10,
      16,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[2], dances[3], criteria, [
      10,
      17,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[2], dances[3], criteria, [
      10,
      18,
      0
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[2], dances[3], criteria, [
      10,
      19,
      0
    ]),
    genJudgeNote(judgeSanction, followers[2], dances[3], penaltyCriterion, 8),
    // Dance 2, follower 3
    ...genFullDanceJudgeNote(judges[0], followers[3], dances[2], criteria, [
      10,
      18,
      0
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[3], dances[2], criteria, [
      10,
      19,
      0
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[3], dances[2], criteria, [
      10,
      19,
      1
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[3], dances[2], criteria, [
      10,
      19,
      2
    ]),
    genJudgeNote(judgeSanction, followers[3], dances[2], penaltyCriterion, 7),
    // Dance 3, follower 3
    ...genFullDanceJudgeNote(judges[0], followers[3], dances[3], criteria, [
      10,
      19,
      1
    ]),
    ...genFullDanceJudgeNote(judges[1], followers[3], dances[3], criteria, [
      10,
      19,
      2
    ]),
    ...genFullDanceJudgeNote(judges[2], followers[3], dances[3], criteria, [
      10,
      19,
      3
    ]),
    ...genFullDanceJudgeNote(judges[3], followers[3], dances[3], criteria, [
      10,
      19,
      4
    ]),
    genJudgeNote(judgeSanction, followers[3], dances[3], penaltyCriterion, 9)
  ];

  const template_round = {
    ...createRound(),
    notationSystem: 'rpss'
  };

  const round2_2_2: Round = {
    ...template_round,
    groups: [
      {
        id: generateId(),
        pairs: [
          genPair(leaders, followers, 0, 0),
          genPair(leaders, followers, 1, 1)
        ],
        dances: [genDance(dances[0].id), genDance(dances[1].id)]
      },
      {
        id: generateId(),
        pairs: [
          genPair(leaders, followers, 2, 2),
          genPair(leaders, followers, 3, 3)
        ],
        dances: [genDance(dances[2].id), genDance(dances[3].id)]
      }
    ]
  };

  test('[INTERNAL] _getDances', () => {
    const scorer = new RPSSRoundScorer(judges, round2_2_2);
    const result: Array<Dance> = scorer._getDances();

    expect(result).toEqual(expect.arrayContaining(dances));
    expect(result).toHaveLength(dances.length);
  }); // [INTERNAL] _getDances

  test('[INTERNAL] _getParticipants', () => {
    const scorer = new RPSSRoundScorer(judges, round2_2_2);
    const result: Array<string> = scorer._getParticipants();
    const expected: Array<mixed> = [
      ...leaders.map(l => l.id),
      ...followers.map(f => f.id)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _getDances

  test('[INTERNAL] _getRoleParticipant', () => {
    const scorer = new RPSSRoundScorer(judges, round2_2_2);
    const resultFollower: Array<string> = scorer._getRoleParticipant(
      'follower'
    );
    const resultLeader: Array<string> = scorer._getRoleParticipant('leader');
    const expectedFollower: Array<mixed> = followers.map(f => f.id);
    const expectedLeader: Array<mixed> = leaders.map(f => f.id);

    expect(resultFollower).toEqual(expect.arrayContaining(expectedFollower));
    expect(resultFollower).toHaveLength(expectedFollower.length);
    expect(resultLeader).toEqual(expect.arrayContaining(expectedLeader));
    expect(resultLeader).toHaveLength(expectedLeader.length);
  }); // [INTERNAL] _getRoleParticipant

  test('[INTERNAL] _isPositiveJudgeType', () => {
    const scorerWithoutPresident = new RPSSRoundScorer(judges, round2_2_2, {
      countPresident: false,
      allowNegative: false
    });
    const scorerWithPresident = new RPSSRoundScorer(judges, round2_2_2, {
      countPresident: true,
      allowNegative: false
    });

    expect(scorerWithoutPresident._isPositiveJudgeType('normal')).toBeTruthy();
    expect(
      scorerWithoutPresident._isPositiveJudgeType('president')
    ).toBeFalsy();
    expect(
      scorerWithoutPresident._isPositiveJudgeType('sanctioner')
    ).toBeFalsy();

    expect(scorerWithPresident._isPositiveJudgeType('normal')).toBeTruthy();
    expect(scorerWithPresident._isPositiveJudgeType('president')).toBeTruthy();
    expect(scorerWithPresident._isPositiveJudgeType('sanctioner')).toBeFalsy();
  }); // [INTERNAL] _isPositiveJudgeType

  test('[INTERNAL] _sumPenalty', () => {
    const scorerWithoutNegativ = new RPSSRoundScorer(judges, round2_2_2, {
      allowNegative: false,
      countPresident: false
    });
    const scorerWithNegativ = new RPSSRoundScorer(judges, round2_2_2, {
      allowNegative: true,
      countPresident: false
    });

    expect(scorerWithoutNegativ._sumPenalty(1, 5)).toEqual(0);
    expect(scorerWithoutNegativ._sumPenalty(5, 4)).toEqual(1);
    expect(scorerWithoutNegativ._sumPenalty(32, 14)).toEqual(18);

    expect(scorerWithNegativ._sumPenalty(1, 5)).toEqual(-4);
    expect(scorerWithNegativ._sumPenalty(5, 4)).toEqual(1);
    expect(scorerWithNegativ._sumPenalty(32, 14)).toEqual(18);
    expect(scorerWithNegativ._sumPenalty(14, 50)).toEqual(-36);
  }); // [INTERNAL] _sumPenalty

  test('[INTERNAL] _getMaxScore', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteria
    };

    const scorer = new RPSSRoundScorer(judges, round);

    expect(scorer._getMaxScore()).toEqual(10 + 19 + 11);
  }); // [INTERNAL] _getMaxScore

  test('[INTERNAL] _computePenalty', () => {
    const scorer = new RPSSRoundScorer(judges, round2_2_2);

    expect(scorer._computePenalty(10, 30)).toEqual((30 * 10) / 100);
    expect(scorer._computePenalty(30, 20)).toEqual((20 * 30) / 100);
    expect(scorer._computePenalty(0, 20)).toEqual((20 * 0) / 100);
    expect(scorer._computePenalty(100, 20)).toEqual(20);
    expect(scorer._computePenalty(4, 40)).toEqual(1.6);
  }); // [INTERNAL] _computePenalty

  test('[INTERNAL] _computeMultipleDanceScore : average', () => {
    const round: Round = {
      ...round2_2_2,
      multipleDanceScoringRule: 'average'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scoresJudge: Array<JudgeScore> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 5),
      genJudgeScore(judges[0], leaders[0], dances[1], 3),
      genJudgeScore(judges[0], leaders[0], dances[2], 2),
      genJudgeScore(judges[0], leaders[0], dances[3], 2)
    ];

    expect(scorer._computeMultipleDanceScore(scoresJudge)).toEqual(3.0);
  }); // [INTERNAL] _computeMultipleDanceScore: average

  test('[INTERNAL] _computeMultipleDanceScore : average float', () => {
    const round: Round = {
      ...round2_2_2,
      multipleDanceScoringRule: 'average'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scoresJudge: Array<JudgeScore> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 4.6),
      genJudgeScore(judges[0], leaders[0], dances[1], 5.8)
    ];

    expect(scorer._computeMultipleDanceScore(scoresJudge)).toEqual(5.2);
  }); // [INTERNAL] _computeMultipleDanceScore: average float

  test('[INTERNAL] _computeMultipleDanceScore : best', () => {
    const round: Round = {
      ...round2_2_2,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scoresJudge: Array<JudgeScore> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 5),
      genJudgeScore(judges[0], leaders[0], dances[1], 3),
      genJudgeScore(judges[0], leaders[0], dances[2], 2),
      genJudgeScore(judges[0], leaders[0], dances[3], 2)
    ];

    expect(scorer._computeMultipleDanceScore(scoresJudge)).toEqual(5.0);
  }); // [INTERNAL] _computeMultipleDanceScore: best

  test('[INTERNAL] _aggregateJudgeNote', () => {
    const round: Round = {
      ...round2_2_2,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scores: Array<JudgeScore> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 5),
      genJudgeScore(judges[0], leaders[0], dances[1], 3),
      genJudgeScore(judges[1], leaders[0], dances[0], 8),
      genJudgeScore(judges[1], leaders[0], dances[1], 5),
      genJudgeScore(judges[2], leaders[0], dances[0], 6),
      genJudgeScore(judges[2], leaders[0], dances[1], 12),
      genJudgeScore(judges[3], leaders[0], dances[0], 2),
      genJudgeScore(judges[3], leaders[0], dances[1], 9)
    ];

    const result: Array<JudgeWeightedNote> = scorer._aggregateJudgeNote(
      scores,
      leaders[0].id
    );
    const expected: Array<mixed> = [
      genJudgeWeightedNote(judges[0], leaders[0], 5),
      genJudgeWeightedNote(judges[1], leaders[0], 8),
      genJudgeWeightedNote(judges[2], leaders[0], 12),
      genJudgeWeightedNote(judges[3], leaders[0], 9)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _aggregateJudgeNote

  test('[INTERNAL] _aggregateDanceNotes : Simple', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteria,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scores: Array<JudgeNote> = [
      ...genFullDanceJudgeNote(judges[0], leaders[0], dances[0], criteria, [
        2,
        6,
        4
      ]),
      ...genFullDanceJudgeNote(judges[1], leaders[0], dances[0], criteria, [
        5,
        1,
        3
      ]),
      ...genFullDanceJudgeNote(judges[2], leaders[0], dances[0], criteria, [
        7,
        1,
        1
      ]),
      ...genFullDanceJudgeNote(judges[3], leaders[0], dances[0], criteria, [
        3,
        4,
        6
      ])
    ];

    const result: Array<JudgeScore> = scorer._aggregateDanceNotes(
      scores,
      leaders[0].id,
      dances[0].id
    );

    const expected: Array<mixed> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 12),
      genJudgeScore(judges[1], leaders[0], dances[0], 9),
      genJudgeScore(judges[2], leaders[0], dances[0], 9),
      genJudgeScore(judges[3], leaders[0], dances[0], 13)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _aggregateDanceNotes : Simple

  test('[INTERNAL] _aggregateDanceNotes : no dance', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteria,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scores: Array<JudgeNote> = [
      ...genFullDanceJudgeNote(judges[0], leaders[0], dances[0], criteria, [
        2,
        6,
        4
      ]),
      ...genFullDanceJudgeNote(judges[1], leaders[0], dances[0], criteria, [
        5,
        1,
        3
      ]),
      ...genFullDanceJudgeNote(judges[2], leaders[0], dances[0], criteria, [
        7,
        1,
        1
      ]),
      ...genFullDanceJudgeNote(judges[3], leaders[0], dances[0], criteria, [
        3,
        4,
        6
      ])
    ];

    const result: Array<JudgeScore> = scorer._aggregateDanceNotes(
      scores,
      leaders[0].id,
      dances[1].id
    );
    const expected: Array<mixed> = [];

    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _aggregateDanceNotes : no dance

  test('[INTERNAL] _aggregateDanceNotes : Stripped', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteria,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judges, round);

    const scores: Array<JudgeNote> = [
      ...genFullDanceJudgeNote(judges[0], leaders[0], dances[0], criteria, [
        2,
        6,
        4
      ]),
      ...genFullDanceJudgeNote(judges[1], leaders[0], dances[0], criteria, [
        5,
        1,
        3
      ]),
      ...genFullDanceJudgeNote(judges[2], leaders[0], dances[0], criteria, [
        7,
        1,
        1
      ]),
      ...genFullDanceJudgeNote(judges[3], leaders[0], dances[0], criteria, [
        3,
        4,
        6
      ]),
      // Should be stripped because of wrong ids
      ...genFullDanceJudgeNote(judges[0], leaders[1], dances[0], criteria, [
        5,
        4,
        9
      ]),
      ...genFullDanceJudgeNote(judges[0], leaders[0], dances[1], criteria, [
        5,
        7,
        2
      ])
    ];

    const result: Array<JudgeScore> = scorer._aggregateDanceNotes(
      scores,
      leaders[0].id,
      dances[0].id
    );
    const expected: Array<mixed> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 12),
      genJudgeScore(judges[1], leaders[0], dances[0], 9),
      genJudgeScore(judges[2], leaders[0], dances[0], 9),
      genJudgeScore(judges[3], leaders[0], dances[0], 13)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _aggregateDanceNotes : Stripped

  test('[INTERNAL] _aggregateDanceNotes : Float', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'average'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const scores: Array<JudgeNote> = [
      ...genFullDanceJudgeNote(judges[0], leaders[0], dances[0], criteria, [
        5,
        0,
        0
      ]),
      ...genFullDanceJudgeNote(judges[1], leaders[0], dances[0], criteria, [
        7,
        0,
        0
      ]),
      genJudgeNote(judgeSanction, leaders[0], dances[0], penaltyCriterion, 3)
    ];

    const result: Array<JudgeScore> = scorer._aggregateDanceNotes(
      scores,
      leaders[0].id,
      dances[0].id
    );

    const penalty: number = scorer._computePenalty(3, 40);
    const expected: Array<mixed> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 5 - penalty),
      genJudgeScore(judges[1], leaders[0], dances[0], 7 - penalty)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _aggregateDanceNotes : Float

  test('[INTERNAL] _aggregateDanceNotes : Penalty', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const scores: Array<JudgeNote> = [
      ...genFullDanceJudgeNote(judges[0], leaders[0], dances[0], criteria, [
        2,
        6,
        4
      ]),
      ...genFullDanceJudgeNote(judges[1], leaders[0], dances[0], criteria, [
        5,
        1,
        3
      ]),
      ...genFullDanceJudgeNote(judges[2], leaders[0], dances[0], criteria, [
        7,
        1,
        1
      ]),
      ...genFullDanceJudgeNote(judges[3], leaders[0], dances[0], criteria, [
        3,
        4,
        6
      ]),
      // Also add a penalty
      genJudgeNote(judgeSanction, leaders[0], dances[0], penaltyCriterion, 3)
    ];

    const result: Array<JudgeScore> = scorer._aggregateDanceNotes(
      scores,
      leaders[0].id,
      dances[0].id
    );

    const penalty: number = scorer._computePenalty(3, 40);
    const expected: Array<mixed> = [
      genJudgeScore(judges[0], leaders[0], dances[0], 12 - penalty),
      genJudgeScore(judges[1], leaders[0], dances[0], 9 - penalty),
      genJudgeScore(judges[2], leaders[0], dances[0], 9 - penalty),
      genJudgeScore(judges[3], leaders[0], dances[0], 13 - penalty)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _aggregateDanceNotes : Penalty

  test('[INTERNAL] _computeJudgeWeightedNotes', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'average'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const result: Array<JudgeWeightedNote> = scorer._computeJudgeWeightedNotes(
      fullScaleScores
    );

    const expected: Array<JudgeWeightedNote> = [
      genJudgeWeightedNote(judges[0], leaders[0], 1 - 0.4),
      genJudgeWeightedNote(judges[1], leaders[0], 2 - 0.4),
      genJudgeWeightedNote(judges[2], leaders[0], 3 - 0.4),
      genJudgeWeightedNote(judges[3], leaders[0], 4 - 0.4),
      genJudgeWeightedNote(judges[0], leaders[1], 5 - 0.8),
      genJudgeWeightedNote(judges[1], leaders[1], 6 - 0.8),
      genJudgeWeightedNote(judges[2], leaders[1], 7 - 0.8),
      genJudgeWeightedNote(judges[3], leaders[1], 8 - 0.8),
      genJudgeWeightedNote(judges[0], leaders[2], 9 - 3 * 0.4),
      genJudgeWeightedNote(judges[1], leaders[2], 10 - 3 * 0.4),
      genJudgeWeightedNote(judges[2], leaders[2], 11 - 3 * 0.4),
      genJudgeWeightedNote(judges[3], leaders[2], 12 - 3 * 0.4),
      genJudgeWeightedNote(judges[0], leaders[3], 13 - 4 * 0.4),
      genJudgeWeightedNote(judges[1], leaders[3], 14 - 4 * 0.4),
      genJudgeWeightedNote(judges[2], leaders[3], 15 - 4 * 0.4),
      genJudgeWeightedNote(judges[3], leaders[3], 16 - 4 * 0.4),
      genJudgeWeightedNote(judges[0], followers[0], 17 - 5 * 0.4),
      genJudgeWeightedNote(judges[1], followers[0], 18 - 5 * 0.4),
      genJudgeWeightedNote(judges[2], followers[0], 19 - 5 * 0.4),
      genJudgeWeightedNote(judges[3], followers[0], 20 - 5 * 0.4),
      genJudgeWeightedNote(judges[0], followers[1], 21 - 6 * 0.4),
      genJudgeWeightedNote(judges[1], followers[1], 22 - 6 * 0.4),
      genJudgeWeightedNote(judges[2], followers[1], 23 - 6 * 0.4),
      genJudgeWeightedNote(judges[3], followers[1], 24 - 6 * 0.4),
      genJudgeWeightedNote(judges[0], followers[2], 25 - 7 * 0.4),
      genJudgeWeightedNote(judges[1], followers[2], 26 - 7 * 0.4),
      genJudgeWeightedNote(judges[2], followers[2], 27 - 7 * 0.4),
      genJudgeWeightedNote(judges[3], followers[2], 28 - 7 * 0.4),
      genJudgeWeightedNote(judges[0], followers[3], 29 - 8 * 0.4),
      genJudgeWeightedNote(judges[1], followers[3], 30 - 8 * 0.4),
      genJudgeWeightedNote(judges[2], followers[3], 31 - 8 * 0.4),
      genJudgeWeightedNote(judges[3], followers[3], 32 - 8 * 0.4)
    ];

    judges.forEach(judge => {
      participants.forEach(participant => {
        const r = result.filter(
          n => n.judgeId === judge.id && n.participantId === participant.id
        );
        const e = expected.filter(
          ex => ex.judgeId === judge.id && ex.participantId === participant.id
        );

        expect(r).toEqual(e);
      });
    });
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _computeJudgeWeightedNotes

  test('[INTERNAL] _genRanksFromWeightedScores : No equality', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const scores: Array<JudgeWeightedNote> = [
      genJudgeWeightedNote(judges[0], leaders[0], 1),
      genJudgeWeightedNote(judges[0], leaders[1], 4),
      genJudgeWeightedNote(judges[0], leaders[2], 3),
      genJudgeWeightedNote(judges[0], leaders[3], 8)
    ];

    const result: Array<JudgeRank> = scorer._genRanksFromWeightedScores(scores);

    const expected: Array<mixed> = [
      genJudgeRank(judges[0], leaders[0], 1, 4),
      genJudgeRank(judges[0], leaders[1], 4, 2),
      genJudgeRank(judges[0], leaders[2], 3, 3),
      genJudgeRank(judges[0], leaders[3], 8, 1)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _genRanksFromWeightedScores : No equality

  test('[INTERNAL] _genRanksFromWeightedScores : With equalities', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const scores: Array<JudgeWeightedNote> = [
      genJudgeWeightedNote(judges[0], leaders[0], 1),
      genJudgeWeightedNote(judges[0], leaders[1], 4),
      genJudgeWeightedNote(judges[0], leaders[2], 4),
      genJudgeWeightedNote(judges[0], leaders[3], 8)
    ];

    const result: Array<JudgeRank> = scorer._genRanksFromWeightedScores(scores);

    const expected: Array<mixed> = [
      genJudgeRank(judges[0], leaders[0], 1, 4),
      genJudgeRank(judges[0], leaders[1], 4, 2),
      genJudgeRank(judges[0], leaders[2], 4, 2),
      genJudgeRank(judges[0], leaders[3], 8, 1)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _genRanksFromWeightedScores : With equalities

  test('[INTERNAL] _genJudgeRanks', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const result: Array<JudgeRank> = scorer._genJudgeRanks(fullScaleScores);

    const expected: Array<mixed> = [
      // judge 0
      genJudgeRank(judges[0], leaders[0], 2 - 0.8, 4),
      genJudgeRank(judges[0], leaders[1], 6 - 1.2, 3),
      genJudgeRank(judges[0], leaders[2], 10 - 1.6, 2),
      genJudgeRank(judges[0], leaders[3], 14 - 2.0, 1),
      genJudgeRank(judges[0], followers[0], 18 - 2.4, 4),
      genJudgeRank(judges[0], followers[1], 22 - 2.8, 3),
      genJudgeRank(judges[0], followers[2], 26 - 3.2, 2),
      genJudgeRank(judges[0], followers[3], 30 - 3.6, 1),
      // judge 1
      genJudgeRank(judges[1], leaders[0], 3 - 0.8, 4),
      genJudgeRank(judges[1], leaders[1], 7 - 1.2, 3),
      genJudgeRank(judges[1], leaders[2], 11 - 1.6, 2),
      genJudgeRank(judges[1], leaders[3], 15 - 2.0, 1),
      genJudgeRank(judges[1], followers[0], 19 - 2.4, 4),
      genJudgeRank(judges[1], followers[1], 23 - 2.8, 3),
      genJudgeRank(judges[1], followers[2], 27 - 3.2, 2),
      genJudgeRank(judges[1], followers[3], 31 - 3.6, 1),
      // judge 2
      genJudgeRank(judges[2], leaders[0], 4 - 0.8, 4),
      genJudgeRank(judges[2], leaders[1], 8 - 1.2, 3),
      genJudgeRank(judges[2], leaders[2], 12 - 1.6, 2),
      genJudgeRank(judges[2], leaders[3], 16 - 2.0, 1),
      genJudgeRank(judges[2], followers[0], 20 - 2.4, 4),
      genJudgeRank(judges[2], followers[1], 24 - 2.8, 3),
      genJudgeRank(judges[2], followers[2], 28 - 3.2, 2),
      genJudgeRank(judges[2], followers[3], 32 - 3.6, 1),
      // judge 3
      genJudgeRank(judges[3], leaders[0], 5 - 0.8, 4),
      genJudgeRank(judges[3], leaders[1], 9 - 1.2, 3),
      genJudgeRank(judges[3], leaders[2], 13 - 1.6, 2),
      genJudgeRank(judges[3], leaders[3], 17 - 2.0, 1),
      genJudgeRank(judges[3], followers[0], 21 - 2.4, 4),
      genJudgeRank(judges[3], followers[1], 25 - 2.8, 3),
      genJudgeRank(judges[3], followers[2], 29 - 3.2, 2),
      genJudgeRank(judges[3], followers[3], 33 - 3.6, 1)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _genJudgeRanks

  test('[INTERNAL] _genRankMatrixRow', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const judgeRanks: Array<JudgeRank> = [
      // leader 0
      genJudgeRank(judges[0], leaders[0], 15, 2),
      genJudgeRank(judges[1], leaders[0], 10, 4),
      genJudgeRank(judges[2], leaders[0], 9, 3),
      genJudgeRank(judges[3], leaders[0], 12, 3),
      // noise

      genJudgeRank(judges[1], followers[1], 23 - 2.8, 3),
      genJudgeRank(judges[1], followers[2], 27 - 3.2, 2),
      genJudgeRank(judges[2], leaders[1], 8 - 1.2, 3),
      genJudgeRank(judges[2], leaders[2], 12 - 1.6, 2),
      genJudgeRank(judges[2], followers[3], 32 - 3.6, 1),
      genJudgeRank(judges[3], followers[3], 33 - 3.6, 1)
    ];

    const result: RankMatrixRow = scorer._genRankMatrixRow(
      leaders[0].id,
      4,
      2,
      judgeRanks
    );

    const expected: RankMatrixRow = genRow(
      leaders[0],
      judgeRanks,
      [0, 1, 3, 4],
      2,
      [0, 2, 8, 12]
    );

    expect(result).toEqual(expected);
  }); // [INTERNAL] _genRankMatrixRow

  test('[INTERNAL] _genRankMatrixRow 2', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const judgeRanks: Array<JudgeRank> = [
      // leader 0
      genJudgeRank(judges[0], leaders[0], 15, 4),
      genJudgeRank(judges[1], leaders[0], 10, 4),
      genJudgeRank(judges[2], leaders[0], 9, 4),
      genJudgeRank(judges[3], leaders[0], 12, 4),
      // noise

      genJudgeRank(judges[1], followers[1], 23 - 2.8, 3),
      genJudgeRank(judges[1], followers[2], 27 - 3.2, 2),
      genJudgeRank(judges[2], leaders[1], 8 - 1.2, 3),
      genJudgeRank(judges[2], leaders[2], 12 - 1.6, 2),
      genJudgeRank(judges[2], followers[3], 32 - 3.6, 1),
      genJudgeRank(judges[3], followers[3], 33 - 3.6, 1)
    ];

    const result: RankMatrixRow = scorer._genRankMatrixRow(
      leaders[0].id,
      4,
      2,
      judgeRanks
    );

    const expected: RankMatrixRow = genRow(
      leaders[0],
      judgeRanks,
      [0, 0, 0, 4],
      3,
      [0, 0, 0, 16]
    );

    expect(result).toEqual(expected);
  }); // [INTERNAL] _genRankMatrixRow 2

  test('[INTERNAL] _genRankMatrix: leaders', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const judgeRanks: Array<JudgeRank> = scorer._genJudgeRanks(fullScaleScores);

    const result: RankMatrix = scorer._genRankMatrix(
      leaders.map(participant => participant.id),
      judgeRanks,
      2
    );

    const expected: Array<mixed> = [
      genRow(leaders[0], judgeRanks, [0, 0, 0, 4], 3, [0, 0, 0, 16]),
      genRow(leaders[1], judgeRanks, [0, 0, 4, 4], 2, [0, 0, 12, 12]),
      genRow(leaders[2], judgeRanks, [0, 4, 4, 4], 1, [0, 8, 8, 8]),
      genRow(leaders[3], judgeRanks, [4, 4, 4, 4], 0, [4, 4, 4, 4])
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _genRankMatrix: leaders

  test('[INTERNAL] _genRankMatrix: followers', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const judgeRanks: Array<JudgeRank> = scorer._genJudgeRanks(fullScaleScores);

    const result: RankMatrix = scorer._genRankMatrix(
      followers.map(participant => participant.id),
      judgeRanks,
      2
    );

    const expected: Array<mixed> = [
      genRow(followers[0], judgeRanks, [0, 0, 0, 4], 3, [0, 0, 0, 16]),
      genRow(followers[1], judgeRanks, [0, 0, 4, 4], 2, [0, 0, 12, 12]),
      genRow(followers[2], judgeRanks, [0, 4, 4, 4], 1, [0, 8, 8, 8]),
      genRow(followers[3], judgeRanks, [4, 4, 4, 4], 0, [4, 4, 4, 4])
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _genRankMatrix: followers

  test('[INTERNAL] _RPSScompare: by rank majority', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const rpssRank1: RankMatrixRow = {
      participantId: leaders[0].id,
      row: [0, 1, 3, 4],
      rankReachMajority: 2,
      sumsRanks: [0, 2, 8, 12],
      ranks: [
        genJudgeRank(judges[0], leaders[0], 2, 3),
        genJudgeRank(judges[1], leaders[0], 3, 3),
        genJudgeRank(judges[2], leaders[0], 5, 2),
        genJudgeRank(judges[3], leaders[0], 1, 4)
      ]
    };

    const rpssRank2: RankMatrixRow = {
      participantId: leaders[1].id,
      row: [0, 0, 1, 4],
      rankReachMajority: 3,
      sumsRanks: [0, 0, 3, 15],
      ranks: [
        genJudgeRank(judges[0], leaders[1], 1, 4),
        genJudgeRank(judges[1], leaders[1], 1, 4),
        genJudgeRank(judges[2], leaders[1], 1, 4),
        genJudgeRank(judges[3], leaders[1], 2, 3)
      ]
    };

    const result: number = scorer._RPSScompare(rpssRank1, rpssRank2);

    const revert_result: number = scorer._RPSScompare(rpssRank2, rpssRank1);

    expect(result < 0).toBeTruthy();
    expect(revert_result > 0).toBeTruthy();
  }); // [INTERNAL] _RPSScompare: : by rank majority

  test('[INTERNAL] _RPSScompare: by votes at same rank', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const rpssRank1: RankMatrixRow = {
      participantId: leaders[0].id,
      row: [1, 3, 4, 4],
      rankReachMajority: 1,
      sumsRanks: [1, 5, 8, 8],
      ranks: [
        genJudgeRank(judges[0], leaders[0], 5, 1),
        genJudgeRank(judges[1], leaders[0], 4, 2),
        genJudgeRank(judges[2], leaders[0], 4, 2),
        genJudgeRank(judges[3], leaders[0], 3, 3)
      ]
    };

    const rpssRank2: RankMatrixRow = {
      participantId: leaders[1].id,
      row: [0, 2, 3, 4],
      rankReachMajority: 1,
      sumsRanks: [0, 4, 7, 11],
      ranks: [
        genJudgeRank(judges[0], leaders[1], 4, 2),
        genJudgeRank(judges[1], leaders[1], 3, 3),
        genJudgeRank(judges[2], leaders[1], 2, 4),
        genJudgeRank(judges[3], leaders[1], 4, 2)
      ]
    };

    const result: number = scorer._RPSScompare(rpssRank1, rpssRank2);

    const revert_result: number = scorer._RPSScompare(rpssRank2, rpssRank1);

    expect(result < 0).toBeTruthy();
    expect(revert_result > 0).toBeTruthy();
  }); // [INTERNAL] _RPSScompare: : by votes at same rank

  test('[INTERNAL] _RPSScompare: by quality at same rank', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const rpssRank1: RankMatrixRow = {
      participantId: leaders[0].id,
      row: [1, 2, 4, 4],
      rankReachMajority: 1,
      sumsRanks: [1, 3, 9, 9],
      ranks: [
        genJudgeRank(judges[0], leaders[0], 5, 1),
        genJudgeRank(judges[1], leaders[0], 4, 2),
        genJudgeRank(judges[2], leaders[0], 3, 3),
        genJudgeRank(judges[3], leaders[0], 3, 3)
      ]
    };

    const rpssRank2: RankMatrixRow = {
      participantId: leaders[1].id,
      row: [0, 2, 3, 4],
      rankReachMajority: 1,
      sumsRanks: [0, 4, 7, 11],
      ranks: [
        genJudgeRank(judges[0], leaders[1], 4, 2),
        genJudgeRank(judges[1], leaders[1], 3, 3),
        genJudgeRank(judges[2], leaders[1], 2, 4),
        genJudgeRank(judges[3], leaders[1], 4, 2)
      ]
    };

    const result: number = scorer._RPSScompare(rpssRank1, rpssRank2);

    const revert_result: number = scorer._RPSScompare(rpssRank2, rpssRank1);

    expect(result < 0).toBeTruthy();
    expect(revert_result > 0).toBeTruthy();
  }); // [INTERNAL] _RPSScompare: : by quality at same rank

  test('[INTERNAL] _RPSScompare: by fallback judge by judge', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };

    const fallbackJudges: Array<Judge> = generateJudges(7);

    const scorer = new RPSSRoundScorer(fallbackJudges, round);

    const rpssRank1: RankMatrixRow = {
      participantId: leaders[0].id,
      row: [3, 6, 7, 7, 7, 7, 7],
      rankReachMajority: 1,
      sumsRanks: [3, 9, 12, 12, 12, 12, 12],
      ranks: [
        genJudgeRank(fallbackJudges[0], leaders[0], 5, 1),
        genJudgeRank(fallbackJudges[1], leaders[0], 4, 2),
        genJudgeRank(fallbackJudges[2], leaders[0], 5, 1),
        genJudgeRank(fallbackJudges[3], leaders[0], 4, 2),
        genJudgeRank(fallbackJudges[4], leaders[0], 3, 3),
        genJudgeRank(fallbackJudges[5], leaders[0], 4, 2),
        genJudgeRank(fallbackJudges[6], leaders[0], 5, 1)
      ]
    };

    const rpssRank2: RankMatrixRow = {
      participantId: leaders[1].id,
      row: [3, 6, 7, 7, 7, 7, 7],
      rankReachMajority: 1,
      sumsRanks: [3, 9, 12, 12, 12, 12, 12],
      ranks: [
        genJudgeRank(fallbackJudges[0], leaders[1], 4, 2),
        genJudgeRank(fallbackJudges[1], leaders[1], 5, 1),
        genJudgeRank(fallbackJudges[2], leaders[1], 3, 3),
        genJudgeRank(fallbackJudges[3], leaders[1], 5, 1),
        genJudgeRank(fallbackJudges[4], leaders[1], 4, 2),
        genJudgeRank(fallbackJudges[5], leaders[1], 5, 1),
        genJudgeRank(fallbackJudges[6], leaders[1], 4, 2)
      ]
    };

    const result: number = scorer._RPSScompare(rpssRank1, rpssRank2);

    const revert_result: number = scorer._RPSScompare(rpssRank2, rpssRank1);

    expect(result > 0).toBeTruthy();
    expect(revert_result < 0).toBeTruthy();
  }); // [INTERNAL] _RPSScompare: : by fallback judge by judge

  test('[INTERNAL] _genScoresFromSortedRankMatrix', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };

    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);
    const judgeRanks: Array<JudgeRank> = scorer._genJudgeRanks(fullScaleScores);

    const rm: RankMatrix = [
      genRow(followers[0], judgeRanks, [0, 0, 0, 4], 3, [0, 0, 0, 16]),
      genRow(followers[1], judgeRanks, [0, 0, 4, 4], 2, [0, 0, 12, 12]),
      genRow(followers[2], judgeRanks, [0, 4, 4, 4], 1, [0, 8, 8, 8]),
      genRow(followers[3], judgeRanks, [4, 4, 4, 4], 0, [4, 4, 4, 4])
    ].sort(scorer._RPSScompare);

    const result: Array<Score> = scorer._genScoresFromSortedRankMatrix(rm, 4);

    const expected: Array<mixed> = [
      createScore(followers[3], 4),
      createScore(followers[2], 3),
      createScore(followers[1], 2),
      createScore(followers[0], 1)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // [INTERNAL] _genScoresFromSortedRankMatrix

  test('[INTERNAL] _genRPSSRanking', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const judgeRanks: Array<JudgeRank> = [
      // judge 0
      genJudgeRank(judges[0], leaders[0], 2 - 0.8, 4),
      genJudgeRank(judges[0], leaders[1], 6 - 1.2, 3),
      genJudgeRank(judges[0], leaders[2], 10 - 1.6, 2),
      genJudgeRank(judges[0], leaders[3], 14 - 2.0, 1),
      genJudgeRank(judges[0], followers[0], 18 - 2.4, 4),
      genJudgeRank(judges[0], followers[1], 22 - 2.8, 3),
      genJudgeRank(judges[0], followers[2], 26 - 3.2, 2),
      genJudgeRank(judges[0], followers[3], 30 - 3.6, 1),
      // judge 1
      genJudgeRank(judges[1], leaders[0], 3 - 0.8, 4),
      genJudgeRank(judges[1], leaders[1], 7 - 1.2, 3),
      genJudgeRank(judges[1], leaders[2], 11 - 1.6, 2),
      genJudgeRank(judges[1], leaders[3], 15 - 2.0, 1),
      genJudgeRank(judges[1], followers[0], 19 - 2.4, 4),
      genJudgeRank(judges[1], followers[1], 23 - 2.8, 3),
      genJudgeRank(judges[1], followers[2], 27 - 3.2, 2),
      genJudgeRank(judges[1], followers[3], 31 - 3.6, 1),
      // judge 2
      genJudgeRank(judges[2], leaders[0], 4 - 0.8, 4),
      genJudgeRank(judges[2], leaders[1], 8 - 1.2, 3),
      genJudgeRank(judges[2], leaders[2], 12 - 1.6, 2),
      genJudgeRank(judges[2], leaders[3], 16 - 2.0, 1),
      genJudgeRank(judges[2], followers[0], 20 - 2.4, 4),
      genJudgeRank(judges[2], followers[1], 24 - 2.8, 3),
      genJudgeRank(judges[2], followers[2], 28 - 3.2, 2),
      genJudgeRank(judges[2], followers[3], 32 - 3.6, 1),
      // judge 3
      genJudgeRank(judges[3], leaders[0], 5 - 0.8, 4),
      genJudgeRank(judges[3], leaders[1], 9 - 1.2, 3),
      genJudgeRank(judges[3], leaders[2], 13 - 1.6, 2),
      genJudgeRank(judges[3], leaders[3], 17 - 2.0, 1),
      genJudgeRank(judges[3], followers[0], 21 - 2.4, 4),
      genJudgeRank(judges[3], followers[1], 25 - 2.8, 3),
      genJudgeRank(judges[3], followers[2], 29 - 3.2, 2),
      genJudgeRank(judges[3], followers[3], 33 - 3.6, 1)
    ];

    const resultLeader: Array<Score> = scorer._genRPSSRanking(
      judgeRanks,
      'leader'
    );

    const resultFollower: Array<Score> = scorer._genRPSSRanking(
      judgeRanks,
      'follower'
    );

    const expectedLeader: Array<mixed> = [
      createScore(leaders[3], 4),
      createScore(leaders[2], 3),
      createScore(leaders[1], 2),
      createScore(leaders[0], 1)
    ];

    const expectedFollower: Array<mixed> = [
      createScore(followers[3], 4),
      createScore(followers[2], 3),
      createScore(followers[1], 2),
      createScore(followers[0], 1)
    ];

    expect(resultLeader).toEqual(expect.arrayContaining(expectedLeader));
    expect(resultLeader).toHaveLength(expectedLeader.length);
    expect(resultFollower).toEqual(expect.arrayContaining(expectedFollower));
    expect(resultFollower).toHaveLength(expectedFollower.length);
  }); // [INTERNAL] _genRPSSRanking

  test('scoreRound', () => {
    const round: Round = {
      ...round2_2_2,
      criteria: criteriaWithPenalty,
      multipleDanceScoringRule: 'best'
    };
    const scorer = new RPSSRoundScorer(judgesWithSanctionner, round);

    const result: Array<Score> = scorer.scoreRound(fullScaleScores);
    const expected: Array<mixed> = [
      createScore(leaders[3], 4),
      createScore(leaders[2], 3),
      createScore(leaders[1], 2),
      createScore(leaders[0], 1),
      createScore(followers[3], 4),
      createScore(followers[2], 3),
      createScore(followers[1], 2),
      createScore(followers[0], 1)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // scoreRound

  test('scoreRound MM test 003', () => {
    const round: Round = {
      ...createRound(),
      notationSystem: 'rpss',
      criteria: [genCriteria(0, 10, 'normal')],
      multipleDanceScoringRule: 'best',
      groups: [
        {
          id: generateId(),
          pairs: [
            genPair(leaders, followers, 0, 0),
            genPair(leaders, followers, 1, 1),
            genPair(leaders, followers, 2, 2),
            genPair(leaders, followers, 3, 3)
          ],
          dances: [genDance(dances[0].id)]
        }
      ]
    };
    const judges: Judge[] = generateJudges(3);
    const scorer = new RPSSRoundScorer(
      judges,
      round,
      {
        countPresident: false,
        allowNegative: false
      },
      false
    );
    const scores = [
      // J1
      genJudgeNote(judges[0], leaders[0], dances[0], criteria[0], 3),
      genJudgeNote(judges[0], leaders[1], dances[0], criteria[0], 1),
      genJudgeNote(judges[0], leaders[2], dances[0], criteria[0], 0),
      genJudgeNote(judges[0], leaders[3], dances[0], criteria[0], 3),
      genJudgeNote(judges[0], followers[0], dances[0], criteria[0], 3),
      genJudgeNote(judges[0], followers[1], dances[0], criteria[0], 1),
      genJudgeNote(judges[0], followers[2], dances[0], criteria[0], 0),
      genJudgeNote(judges[0], followers[3], dances[0], criteria[0], 3),
      // J2
      genJudgeNote(judges[1], leaders[0], dances[0], criteria[0], 4),
      genJudgeNote(judges[1], leaders[1], dances[0], criteria[0], 1),
      genJudgeNote(judges[1], leaders[2], dances[0], criteria[0], 3),
      genJudgeNote(judges[1], leaders[3], dances[0], criteria[0], 1),
      genJudgeNote(judges[1], followers[0], dances[0], criteria[0], 5),
      genJudgeNote(judges[1], followers[1], dances[0], criteria[0], 1),
      genJudgeNote(judges[1], followers[2], dances[0], criteria[0], 4),
      genJudgeNote(judges[1], followers[3], dances[0], criteria[0], 3),
      // J3
      genJudgeNote(judges[2], leaders[0], dances[0], criteria[0], 2),
      genJudgeNote(judges[2], leaders[1], dances[0], criteria[0], 1),
      genJudgeNote(judges[2], leaders[2], dances[0], criteria[0], 0),
      genJudgeNote(judges[2], leaders[3], dances[0], criteria[0], 5),
      genJudgeNote(judges[2], followers[0], dances[0], criteria[0], 4),
      genJudgeNote(judges[2], followers[1], dances[0], criteria[0], 2),
      genJudgeNote(judges[2], followers[2], dances[0], criteria[0], 1),
      genJudgeNote(judges[2], followers[3], dances[0], criteria[0], 10)
    ];

    const result: Array<Score> = scorer.scoreRound(scores);
    const expected: Array<mixed> = [
      createScore(leaders[0], 4),
      createScore(leaders[3], 3),
      createScore(leaders[1], 2),
      createScore(leaders[2], 1),
      createScore(followers[0], 4),
      createScore(followers[3], 3),
      createScore(followers[1], 2),
      createScore(followers[2], 1)
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  }); // scoreRound MM test 003
});

function generateLeaders(n: number): Array<Participant> {
  var leaders: Array<Participant> = [];
  for (var i = 0; i < n; i++) {
    leaders.push(createLeader());
  }

  return leaders;
} // generateLeaders

function generateFollowers(n: number): Array<Participant> {
  var followers: Array<Participant> = [];
  for (var i = 0; i < n; i++) {
    followers.push(createFollower());
  }

  return followers;
} // generateFollowers

function generateJudges(n: number): Array<Judge> {
  var judges: Array<Judge> = [];
  for (var i = 0; i < n; i++) {
    judges.push(createJudge());
  }

  return judges;
} // generateJudges

function genPair(
  leaders: Array<Participant>,
  followers: Array<Participant>,
  idLeader: number,
  idFollow: number
): Pair {
  return {
    leader: leaders[idLeader].id,
    follower: followers[idFollow].id
  };
} // genPair

function genJudgeScore(
  judge: Judge,
  participant: Participant,
  dance: Dance,
  score: number
) {
  return {
    judgeId: judge.id,
    participantId: participant.id,
    danceId: dance.id,
    score: score
  };
} // genJudgeScore

function genFullDanceJudgeNote(
  judge: Judge,
  participant: Participant,
  dance: Dance,
  criteria: Array<RoundCriterion>,
  scores: Array<number>
): Array<JudgeNote> {
  // Checks
  if (criteria.length != scores.length) {
    throw 'Criteria length != score length';
  }

  let notes: Array<JudgeNote> = [];

  criteria.forEach((crit, index) => {
    notes.push(genJudgeNote(judge, participant, dance, crit, scores[index]));
  });

  return notes;
} // genFullDanceJudgeNote

function genJudgeNote(
  judge: Judge,
  participant: Participant,
  dance: Dance,
  criterion: RoundCriterion,
  score: number
): JudgeNote {
  return {
    judgeId: judge.id,
    danceId: dance.id,
    criterionId: criterion.id,
    participantId: participant.id,
    value: score
  };
} // genJudgeNote

function genJudgeRank(
  judge: Judge,
  participant: Participant,
  score: number,
  rank: number
): JudgeRank {
  return {
    judgeId: judge.id,
    participantId: participant.id,
    score: score,
    rank: rank
  };
} // genJudgeRank

function genJudgeWeightedNote(
  judge: Judge,
  participant: Participant,
  score: number
) {
  return {
    judgeId: judge.id,
    participantId: participant.id,
    score: score
  };
} // genJudgeWeightedNote

function genCriteria(
  min: number,
  max: number,
  forJudgeType: JudgeType
): RoundCriterion {
  return {
    id: generateId(),
    name: 'style',
    minValue: min,
    maxValue: max,
    description: 'style...',
    forJudgeType: forJudgeType
  };
} // genCriteria

function genDance(id: string): Dance {
  return {
    id: id,
    active: false,
    finished: true
  };
} // genDance

function genRow(
  participant: Participant,
  judgeRanks: Array<JudgeRank>,
  rows: Array<number>,
  rankReachMajority: number,
  sumRanks: Array<number>
): RankMatrixRow {
  return {
    participantId: participant.id,
    row: rows,
    rankReachMajority: rankReachMajority,
    sumsRanks: sumRanks,
    ranks: judgeRanks.filter(rank => rank.participantId === participant.id)
  };
} // genRow

function createScore(participant: Participant, score: number): Score {
  return {
    participantId: participant.id,
    score: score
  };
} // createScore
