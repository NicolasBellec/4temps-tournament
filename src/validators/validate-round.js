// @flow

function validateMultipleDanceScoringRule({ danceCount, multipleDanceScoringRule }: Round) {
  const isValidRule = multipleDanceScoringRule === 'average' || multipleDanceScoringRule === 'best'

  const isValidEnum = isValidRule || multipleDanceScoringRule === 'none'
  const danceCountOrZero = danceCount || 0

  return isValidRule || (isValidEnum && danceCountOrZero <= 1)
}

function validateCriterion({
  name,
  description,
  minValue,
  maxValue,
  forJudgeType,
}: RoundCriterion) {
  const isValidName = name.length > 0
  const isValidMinValue = minValue != null
  const isValidMaxValue = maxValue != null

  const isValidValueCombination = maxValue != null && minValue != null ? maxValue > minValue : true

  const isValidDescription = description.length > 0

  const isValidForJudgeType = forJudgeType === 'normal' || forJudgeType === 'sanctioner'

  return {
    isValidCriterion:
      isValidName &&
      isValidMinValue &&
      isValidMaxValue &&
      isValidValueCombination &&
      isValidDescription &&
      isValidForJudgeType,
    isValidName,
    isValidMinValue,
    isValidMaxValue,
    isValidValueCombination,
    isValidDescription,
    isValidForJudgeType,
  }
}

function validateCriteria(criteria: Array<RoundCriterion>) {
  if (criteria.length === 0) {
    return { isValidCriteria: true, criteriaValidation: [] }
  }

  const criteriaValidation = criteria.map(validateCriterion)
  const isValidCriteria = criteriaValidation.reduce((acc, cur) => acc && cur.isValidCriterion, true)

  return {
    isValidCriteria,
    criteriaValidation,
  }
}

export default function validateRound(round: Round): RoundValidationSummary {
  const {
    name,
    danceCount,
    minPairCountPerGroup,
    maxPairCountPerGroup,
    passingCouplesCount,
    criteria,
    errorOnSameScore,
    notationSystem,
  } = round

  const isValidName = name.length > 0
  const isValidDanceCount = danceCount != null && danceCount >= 1
  const isValidPassingCouplesCount = passingCouplesCount != null && passingCouplesCount >= 1
  const isValidMinPairCount = minPairCountPerGroup != null && minPairCountPerGroup >= 1
  const isValidMaxPairCount = maxPairCountPerGroup != null && maxPairCountPerGroup >= 1

  const isMaxPairGreaterOrEqualToMinPair =
    minPairCountPerGroup == null ||
    maxPairCountPerGroup == null ||
    maxPairCountPerGroup >= minPairCountPerGroup

  const isValidMultipleDanceScoringRule = validateMultipleDanceScoringRule(round)

  const isValidAmountOfCriteria = criteria.length > 0

  const isValidErrorOnSameScore = typeof errorOnSameScore === 'boolean'

  const isValidNotationSystem = notationSystem === 'sum' || notationSystem === 'rpss'

  const { isValidCriteria, criteriaValidation } = validateCriteria(criteria)

  return {
    isValidRound:
      isValidName &&
      isValidDanceCount &&
      isValidMinPairCount &&
      isValidMaxPairCount &&
      isValidPassingCouplesCount &&
      isMaxPairGreaterOrEqualToMinPair &&
      isValidMultipleDanceScoringRule &&
      isValidNotationSystem &&
      isValidAmountOfCriteria &&
      isValidCriteria,
    isValidName,
    isValidDanceCount,
    isValidMinPairCount,
    isValidMaxPairCount,
    isValidPassingCouplesCount,
    isMaxPairGreaterOrEqualToMinPair,
    isValidMultipleDanceScoringRule,
    isValidAmountOfCriteria,
    isValidCriteria,
    criteriaValidation,
    isValidErrorOnSameScore,
    isValidNotationSystem,
  }
}
