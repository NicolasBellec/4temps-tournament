// no-flow

import validateRound from '../validate-round'
import { createRound as createRoundTestUtils } from '../../test-utils'

function createRound(vals: mixed): Round {
  return {
    ...createRoundTestUtils(),
    ...vals,
  }
}

function createCriterion(vals: mixed): RoundCriterion {
  return {
    id: 'an id',
    name: 'style',
    description: 'How beautiful their style is...',
    minValue: 0,
    maxValue: 100,
    type: 'both',
    forJudgeType: 'normal',
    ...vals,
  }
}

describe('Round validator', () => {
  test('Empty name is invalid', () => {
    expect(validateRound(createRound({ name: '' }))).toMatchObject({
      isValidRound: false,
      isValidName: false,
    })
  })
  test('null dance count is invalid', () => {
    expect(validateRound(createRound({ danceCount: null }))).toMatchObject({
      isValidRound: false,
      isValidDanceCount: false,
    })
  })
  test('Zero dance count is invalid', () => {
    expect(validateRound(createRound({ danceCount: 0 }))).toMatchObject({
      isValidRound: false,
      isValidDanceCount: false,
    })
  })
  test('Negative dance count is invalid', () => {
    expect(validateRound(createRound({ danceCount: -1 }))).toMatchObject({
      isValidRound: false,
      isValidDanceCount: false,
    })
  })
  test('Positive dance count is valid', () => {
    expect(validateRound(createRound({ danceCount: 1 }))).toMatchObject({
      isValidRound: true,
      isValidDanceCount: true,
    })
    expect(validateRound(createRound({ danceCount: 100 }))).toMatchObject({
      isValidRound: true,
      isValidDanceCount: true,
    })
  })

  test('At least one couple has to pass', () => {
    expect(validateRound(createRound({ passingCouplesCount: 0 }))).toMatchObject({
      isValidRound: false,
      isValidPassingCouplesCount: false,
    })
    expect(validateRound(createRound({ passingCouplesCount: 1 }))).toMatchObject({
      isValidRound: true,
      isValidPassingCouplesCount: true,
    })
  })

  test('null minPairCountPerGroup is invalid', () => {
    expect(validateRound(createRound({ minPairCountPerGroup: null }))).toMatchObject({
      isValidRound: false,
      isValidMinPairCount: false,
    })
  })
  test('Zero minPairCountPerGroup is invalid', () => {
    expect(validateRound(createRound({ minPairCountPerGroup: 0 }))).toMatchObject({
      isValidRound: false,
      isValidMinPairCount: false,
    })
  })
  test('Negative minPairCountPerGroup is invalid', () => {
    expect(validateRound(createRound({ minPairCountPerGroup: -1 }))).toMatchObject({
      isValidRound: false,
      isValidMinPairCount: false,
    })
  })
  test('Positive minPairCountPerGroup is valid', () => {
    expect(validateRound(createRound({ minPairCountPerGroup: 1 }))).toMatchObject({
      isValidRound: true,
      isValidMinPairCount: true,
    })
  })

  test('null maxPairCountPerGroup is invalid', () => {
    expect(validateRound(createRound({ maxPairCountPerGroup: null }))).toMatchObject({
      isValidRound: false,
      isValidMaxPairCount: false,
    })
  })
  test('Zero maxPairCountPerGroup is invalid', () => {
    expect(validateRound(createRound({ maxPairCountPerGroup: 0 }))).toMatchObject({
      isValidRound: false,
      isValidMaxPairCount: false,
    })
  })
  test('Negative maxPairCountPerGroup is invalid', () => {
    expect(validateRound(createRound({ maxPairCountPerGroup: -1 }))).toMatchObject({
      isValidRound: false,
      isValidMaxPairCount: false,
    })
  })
  test('Positive maxPairCountPerGroup is valid', () => {
    expect(validateRound(createRound({ maxPairCountPerGroup: 1 }))).toMatchObject({
      isValidRound: true,
      isValidMaxPairCount: true,
    })
    expect(validateRound(createRound({ maxPairCountPerGroup: 123 }))).toMatchObject({
      isValidRound: true,
      isValidMaxPairCount: true,
    })
  })

  test('Max pair count may be equal to min pair count', () => {
    expect(
      validateRound(createRound({ minPairCountPerGroup: 1, maxPairCountPerGroup: 1 }))
    ).toMatchObject({ isValidRound: true })
  })
  test('Max pair count may not be less than min pair count', () => {
    expect(
      validateRound(createRound({ minPairCountPerGroup: 2, maxPairCountPerGroup: 1 }))
    ).toMatchObject({
      isValidRound: false,
      isMaxPairGreaterOrEqualToMinPair: false,
    })
  })

  test('Notation system must be set', () => {
    expect(validateRound(createRound({ notationSystem: 'none' }))).toMatchObject({
      isValidRound: false,
    })
  })

  test('Multiple dances scoring rule may not be set if the dance count is 1', () => {
    ;['none', 'average', 'best'].map((multipleDanceScoringRule) => {
      expect(
        validateRound(
          createRound({
            multipleDanceScoringRule,
            danceCount: 1,
          })
        )
      ).toMatchObject({
        isValidRound: true,
        isValidMultipleDanceScoringRule: true,
      })
    })
  })

  test('Multiple dances scoring rule must be set if dance count is higher than 1', () => {
    expect(
      validateRound(
        createRound({
          multipleDanceScoringRule: 'none',
          danceCount: 2,
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidMultipleDanceScoringRule: false,
    })
    ;['average', 'best'].map((multipleDanceScoringRule) => {
      expect(
        validateRound(
          createRound({
            multipleDanceScoringRule,
            danceCount: 2,
          })
        )
      ).toMatchObject({
        isValidRound: true,
        isValidMultipleDanceScoringRule: true,
      })
    })
  })

  test('Multiple dances scoring rule must have a valid value', () => {
    expect(
      validateRound(
        createRound({
          multipleDanceScoringRule: 'bogus_value',
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidMultipleDanceScoringRule: false,
    })
  })

  test('Having no criteria is invalid', () => {
    expect(validateRound(createRound({ criteria: [] }))).toMatchObject({
      isValidRound: false,
      isValidAmountOfCriteria: false,
    })
  })
  test('Having least one criteria is valid', () => {
    expect(validateRound(createRound({ criteria: [createCriterion()] }))).toMatchObject({
      isValidRound: true,
      isValidAmountOfCriteria: true,
    })

    expect(
      validateRound(
        createRound({
          criteria: [createCriterion(), createCriterion(), createCriterion(), createCriterion()],
        })
      )
    ).toMatchObject({
      isValidRound: true,
      isValidAmountOfCriteria: true,
    })
  })

  test('A criterion may not have a empty name', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ name: '' })],
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidName: false,
        },
      ],
    })
  })

  test('A criterion may have a non-empty name', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ name: 'style' })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
      isValidCriteria: true,
      criteriaValidation: [
        {
          isValidCriterion: true,
          isValidName: true,
        },
      ],
    })
  })

  test('A criterion may not have a empty description', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ description: '' })],
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidDescription: false,
        },
      ],
    })
  })

  test('A criterion may have a non-empty description', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ description: 'They have to be beautiful' })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
      criteriaValidation: [
        {
          isValidDescription: true,
        },
      ],
    })
  })

  test('A criterion may not have a null minValue', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ minValue: null })],
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidMinValue: false,
        },
      ],
    })
  })

  test('A criterion may have a negative minValue', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ minValue: -1 })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
    })
  })

  test('A criterion may have a zero or larger minValue', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ minValue: 0 }), createCriterion({ minValue: 3 })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
    })
  })

  test('A criterion may not have a null maxValue', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ maxValue: null })],
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidMaxValue: false,
        },
      ],
    })
  })

  test('A criterion may have a negative maxValue', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ maxValue: -1, minValue: -2 })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
    })
  })

  test('A criterion may have a positive non-zero maxValue', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ maxValue: 3 })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
    })
  })

  test('A criterion may not have an equal min value and max value', () => {
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ minValue: 1, maxValue: 1 })],
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidValueCombination: false,
        },
      ],
    })
  })

  test('A criterion must be for a valid judge type', () => {
    expect(
      validateRound(createRound({ criteria: [createCriterion({ forJudgeType: '' })] }))
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidForJudgeType: false,
        },
      ],
    })
    expect(
      validateRound(createRound({ criteria: [createCriterion({ forJudgeType: 'normal' })] }))
    ).toMatchObject({
      isValidRound: true,
    })
    expect(
      validateRound(
        createRound({
          criteria: [createCriterion({ forJudgeType: 'sanctioner' })],
        })
      )
    ).toMatchObject({
      isValidRound: true,
    })
  })

  test('All criteria are validated and are ordered', () => {
    expect(
      validateRound(
        createRound({
          criteria: [
            createCriterion({ name: '' }),
            createCriterion({ minValue: null }),
            createCriterion({ maxValue: null }),
            createCriterion({ description: '' }),
          ],
        })
      )
    ).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidName: false,
        },
        {
          isValidCriterion: false,
          isValidMinValue: false,
        },
        {
          isValidCriterion: false,
          isValidMaxValue: false,
        },
        {
          isValidCriterion: false,
          isValidDescription: false,
        },
      ],
    })
  })
})
