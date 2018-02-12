// @flow
import {
  createCriterion,
  createJudge,
  createParticipant,
  createTournament,
  createRound,
  generateId
} from '../../test-utils';
import NoteChecker from '../note-checker';

describe('Checker that all notes are submitted', () => {
  test('If a judge has not set a criterion for a participant, false is returned', () => {
    const criteria = [createCriterion()];
    const judges = [createJudge()];
    const participants = [createParticipant()];
    const danceId = generateId();

    const tournament: Tournament = {
      ...createTournament(),
      judges,
      participants,
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria,
          groups: [
            {
              id: generateId(),
              pairs: [{ follower: generateId(), leader: generateId() }],
              dances: [
                {
                  id: danceId,
                  active: true,
                  finished: false
                }
              ]
            }
          ]
        }
      ]
    };

    const notes = [];

    const checker = new NoteChecker(tournament);
    expect(checker.allSetForDance(danceId, notes)).toBe(false);
  });

  test('If a judge has set a criterion for a participant, true is returned', () => {
    const criteria = [{ ...createCriterion(), role: 'leaderAndFollower' }];
    const judges = [createJudge()];
    const participants = [createParticipant(), createParticipant()];
    const danceId = generateId();

    const tournament: Tournament = {
      ...createTournament(),
      judges,
      participants,
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria,
          groups: [
            {
              id: generateId(),
              pairs: [
                { follower: participants[0].id, leader: participants[1].id }
              ],
              dances: [
                {
                  id: danceId,
                  active: true,
                  finished: false
                }
              ]
            }
          ]
        }
      ]
    };

    const notes: Array<JudgeNote> = [
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      }
    ];

    const checker = new NoteChecker(tournament);
    expect(checker.allSetForDance(danceId, notes)).toBe(true);
  });

  test('Everything must be set, missing criteria', () => {
    const criteria = [
      { ...createCriterion(), type: 'both' },
      { ...createCriterion(), type: 'one' }
    ];
    const judges = [createJudge(), createJudge()];
    const participants = [
      createParticipant(),
      { ...createParticipant(), role: 'follower' }
    ];
    const danceId = generateId();

    const tournament: Tournament = {
      ...createTournament(),
      judges,
      participants,
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria,
          groups: [
            {
              id: generateId(),
              pairs: [
                { follower: participants[1].id, leader: participants[0].id }
              ],
              dances: [
                {
                  id: danceId,
                  active: true,
                  finished: false
                }
              ]
            }
          ]
        }
      ]
    };

    const notes: Array<JudgeNote> = [
      // leader
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[0].id,
        value: 0
      },
      // follower
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[1].id,
        value: 0
      }
      //{
      //  judgeId: judges[1].id,
      //  danceId,
      //  criterionId: criteria[1].id,
      //  participantId: participants[1].id,
      //  value: 0
      //},
    ];

    const checker = new NoteChecker(tournament);
    expect(checker.allSetForDance(danceId, notes)).toBe(false);
  });

  test('Everything must be set, valid', () => {
    const criteria = [
      { ...createCriterion(), type: 'both' },
      { ...createCriterion(), type: 'one' }
    ];
    const judges = [createJudge(), createJudge()];
    const participants = [
      createParticipant(),
      { ...createParticipant(), role: 'follower' }
    ];
    const danceId = generateId();

    const tournament: Tournament = {
      ...createTournament(),
      judges,
      participants,
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria,
          groups: [
            {
              id: generateId(),
              pairs: [
                { follower: participants[1].id, leader: participants[0].id }
              ],
              dances: [
                {
                  id: danceId,
                  active: true,
                  finished: false
                }
              ]
            }
          ]
        }
      ]
    };

    const notes: Array<JudgeNote> = [
      // leader
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[0].id,
        value: 0
      },
      // follower
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[1].id,
        value: 0
      },
      {
        judgeId: judges[1].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[1].id,
        value: 0
      }
    ];

    const checker = new NoteChecker(tournament);
    expect(checker.allSetForDance(danceId, notes)).toBe(true);
  });

  test('Can check for one judge', () => {
    const criteria = [
      { ...createCriterion(), type: 'both' },
      { ...createCriterion(), type: 'one' }
    ];
    const judges = [createJudge(), createJudge()];
    const participants = [
      createParticipant(),
      { ...createParticipant(), role: 'follower' }
    ];
    const danceId = generateId();

    const tournament: Tournament = {
      ...createTournament(),
      judges,
      participants,
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria,
          groups: [
            {
              id: generateId(),
              pairs: [
                { follower: participants[1].id, leader: participants[0].id }
              ],
              dances: [
                {
                  id: danceId,
                  active: true,
                  finished: false
                }
              ]
            }
          ]
        }
      ]
    };

    const notes: Array<JudgeNote> = [
      // leader
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      //{
      //  judgeId: judges[0].id,
      //  danceId,
      //  criterionId: criteria[1].id,
      //  participantId: participants[0].id,
      //  value: 0
      //},
      // follower
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      }
    ];

    const checker = new NoteChecker(tournament);
    expect(checker.allSetForDanceByJudge(danceId, notes, judges[0].id)).toBe(
      false
    );
  });

  test('Can check for one judge, true', () => {
    const criteria = [
      { ...createCriterion(), type: 'both' },
      { ...createCriterion(), type: 'one' }
    ];
    const judges = [createJudge(), createJudge()];
    const participants = [
      createParticipant(),
      { ...createParticipant(), role: 'follower' }
    ];
    const danceId = generateId();

    const tournament: Tournament = {
      ...createTournament(),
      judges,
      participants,
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria,
          groups: [
            {
              id: generateId(),
              pairs: [
                { follower: participants[1].id, leader: participants[0].id }
              ],
              dances: [
                {
                  id: danceId,
                  active: true,
                  finished: false
                }
              ]
            }
          ]
        }
      ]
    };

    const notes: Array<JudgeNote> = [
      // leader
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[0].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[0].id,
        value: 0
      },
      // follower
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[0].id,
        participantId: participants[1].id,
        value: 0
      },
      {
        judgeId: judges[0].id,
        danceId,
        criterionId: criteria[1].id,
        participantId: participants[1].id,
        value: 0
      }
    ];

    const checker = new NoteChecker(tournament);
    expect(checker.allSetForDanceByJudge(danceId, notes, judges[0].id)).toBe(
      true
    );
  });
});
