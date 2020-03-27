// @flow

type Placement = {
  participantId: string,
  score: number,
  placement: number
};

type JudgePlacement = Array<Placement>;

type MapJudgePlacement = {
  [judgeId: string]: JudgePlacement
};

type SeparatedPlacement = {
  leader: MapJudgePlacement,
  follower: MapJudgePlacement
};

type MapJudgeScoreUnflatten = {
  [judgeId: string]: {
    [participantId: string]: {
      [danceId: string]: number
    }
  }
};

type MapJudgeParticipantScore = {
  [judgeId: string]: {
    [participantId: string]: number
  }
};

type SanctionMap = {
  [participantId: string]: {
    [danceId: string]: number
  }
};

type RankMatrix = Array<{
  [participantId: string]: number
}>;

type MapParticipant = {
  [participantId: string]: Array<number>
};

type ParticipantStats = {
  participantId: string,
  min_rank: number,
  sums_rank: Array<number>,
  judgeScores: {
    [judgeId: string]: number
  },
  majority_amount: number
};

export default class RPSSRoundScorer {
  _judges: Array<Judge>;
  _round: Round;
  _criteria: { [id: string]: RoundCriterion };
  _countPresident: boolean;
  _allowNegative: boolean;

  constructor(
    judges: Array<Judge>,
    round: Round,
    {
      countPresident,
      allowNegative
    }: {
      countPresident: boolean,
      allowNegative: boolean
    } = { countPresident: false, allowNegative: false }
  ) {
    this._judges = judges;
    this._criteria = round.criteria.reduce(
      (acc, crit) => ({ ...acc, [crit.id]: crit }),
      {}
    );
    this._round = round;
    this._countPresident = countPresident;
    this._allowNegative = allowNegative;
  }

  scoreRound(notes: Array<JudgeNote>): Array<Score> {
    const placements: SeparatedPlacement = this._transformToPlacement(notes);
    const leader_ranking: Array<Score> = this._genRanking(
      placements.leader,
      'leader'
    );
    const follower_ranking: Array<Score> = this._genRanking(
      placements.follower,
      'follower'
    );

    return [...leader_ranking, ...follower_ranking];
  }

  _genRanking(placements: MapJudgePlacement, role: ParticipantRole): Array<Score> {
    const judgeMajority = Math.ceil(this._judges.length / 2);

    const participants: Array<string> = this._getRoleParticipant(role);
    const max_rank = participants.length;

    // Generate for each participant the array of its placements
    const mapParticipant: MapParticipant = participants.reduce(
      (acc, participantId) => ({
        ...acc,
        [participantId]: Object.keys(placements).map(judgeId => {
          const place: ?Placement = placements[judgeId].find(
            el => el.participantId === participantId
          );
          return place != null ? place.placement : max_rank;
        })
      }),
      {}
    );
    const mapParticipantJudge = participants.reduce(
      (acc, participantId) => ({
        ...acc,
        [participantId]: Object.keys(placements)
          .map(judgeId => {
            const place: ?Placement = placements[judgeId].find(
              el => el.participantId === participantId
            );
            return {
              judgeId: judgeId,
              rank: place != null ? place.placement : max_rank
            };
          })
          .reduce(
            (acc, el) => ({
              ...acc,
              [el.judgeId]: el.rank
            }),
            {}
          )
      }),
      {}
    );

    const rankMatrix: RankMatrix = this._genRankMatrix(
      mapParticipant,
      participants
    );

    const participantStats: Array<ParticipantStats> = participants
      .map(participantId => ({
        participantId: participantId,
        min_rank: this._range(0, max_rank).reduce((acc, rank) => {
          if (acc !== -1) {
            return acc;
          } else if (rankMatrix[rank][participantId] >= judgeMajority) {
            return rank;
          }
          return -1;
        }, -1)
      }))
      .map(obj => ({
        ...obj,
        sums_rank: this._range(obj.min_rank, max_rank).map(min_rank =>
          mapParticipant[obj.participantId]
            .filter(rank => rank <= min_rank)
            .reduce((acc, rank) => acc + rank, 0)
        ),
        judgeScores: mapParticipantJudge[obj.participantId],
        majority_amount: mapParticipant[obj.participantId].filter(
          rank => rank <= obj.min_rank
        ).length
      }));

    const sortedParticipant: Array<Array<ParticipantStats>> =
      this._sortWithEquality(
        participantStats, this._sortPlacements
      );

    var ranking: Array<Score> = this._transformSortedToRanking(
      sortedParticipant,
      max_rank
    );
    return ranking;
  }

  _transformSortedToRanking(
    sortedParticipant: Array<Array<ParticipantStats>>,
    max_rank: number
  ): Array<Score> {
    var ranking: Array<Score> = [];
    var cur_rank: number = max_rank;

    for (let equality of sortedParticipant) {
      for (let participant of equality) {
        ranking.push({
          participantId: participant.participantId,
          score: cur_rank
        });
      }

      cur_rank -= equality.length;
    }

    return ranking;
  }

  _sortWithEquality<T>(
    toSort: Array<T>,
    sort_func: (T, T) => number
  ): Array<Array<T>> {
    // Sort the array and handle equalities by returning an array of arrays
    var sortedWithEquality: Array<Array<T>> = [];

    // First, sort the array
    toSort.sort(sort_func);

    // Then iterate on the sorted array and detect
    // following elements with the same rank
    for (let i = 0; i < toSort.length; ++i) {
      const first_el = toSort[i];
      sortedWithEquality.push([first_el]);

      for (let j = i + 1; sort_func(first_el, toSort[j]) === 0; ++j) {
        sortedWithEquality[sortedWithEquality.length - 1].push(toSort[j]);
      }

      // Forward the loop by the number of elements found that are equals to
      // first_el
      i += sortedWithEquality[sortedWithEquality.length - 1].length - 1;
    }

    return sortedWithEquality;
  }

  _genRankMatrix(
    mapParticipant: MapParticipant,
    participants: Array<string>
  ): RankMatrix {
    var rankMatrix: Array<{
      [participantId: string]: number
    }> = [];
    for (let i = 0; i < participants.length; ++i) {
      rankMatrix[i] = {};

      for (let participantId of Object.keys(mapParticipant)) {
        let ranks: Array<number> = mapParticipant[participantId];
        rankMatrix[i][participantId] = ranks.filter(
          rank => rank <= i + 1
        ).length;
      }
    }

    return rankMatrix;
  }

  _transformToPlacement(notes: Array<JudgeNote>): SeparatedPlacement {
    /*
      1) Recover the note for each judge for each dance
      2) Apply the sanction on each judge note
      3) Sort for each judge on the final score
    */
    const unflattenScore: MapJudgeScoreUnflatten = this._unflattenJudgeScore(
      notes
    );
    const sanctionScores: SanctionMap = this._computeSanctions(unflattenScore);
    const summedScores: MapJudgeScoreUnflatten = this._applyNegativScores(
      unflattenScore,
      sanctionScores
    );
    const finalScores: MapJudgeParticipantScore = this._scoreFromDanceRule(
      summedScores
    );

    //NOTE: Does not handle leaderAndFollower, should not happen.
    const leader_ranking: MapJudgePlacement = this._generateRolePlacement(
      finalScores,
      sanctionScores,
      'leader'
    );
    const follower_ranking: MapJudgePlacement = this._generateRolePlacement(
      finalScores,
      sanctionScores,
      'follower'
    );

    return { leader: leader_ranking, follower: follower_ranking };
  }

  _generateRolePlacement(
    scores: MapJudgeParticipantScore,
    sanctionScores: SanctionMap,
    role: ParticipantRole
  ): MapJudgePlacement {
    let placement: MapJudgePlacement = {};
    const roleParticipant: Array<string> = this._getRoleParticipant(role);

    for (const judgeId of Object.keys(scores)) {
      placement[judgeId] = Object.keys(scores[judgeId])
        .filter(participantId => {
          roleParticipant.includes(participantId);
        })
        .map(participantId => ({
          participantId: participantId,
          score: scores[judgeId][participantId]
        }))
        .sort(this._sortScore)
        .map(score => ({
          ...score,
          placement: 0
        }));

      var current_place = 1;
      var current_score = placement[judgeId][0].score;
      for (var i = 0; i < placement[judgeId].length; i++) {
        if (placement[judgeId][i].score !== current_score) {
          current_place = i + 1;
          current_score = placement[judgeId][i].score;
        }
        placement[judgeId][i].placement = current_place;
      }
    }

    return placement;
  }

  _scoreFromDanceRule(
    scores: MapJudgeScoreUnflatten
  ): MapJudgeParticipantScore {
    let finalScores: MapJudgeParticipantScore = {};

    for (const judgeId of Object.keys(scores)) {
      finalScores[judgeId] = {};

      for (const participantId of Object.keys(scores[judgeId])) {
        if (this._round.danceScoringRule === 'average') {
          finalScores[judgeId][participantId] =
            (Object.keys(scores[judgeId][participantId]).reduce(
              (acc, danceId) => acc + scores[judgeId][participantId][danceId],
              0
            ) *
              1.0) /
            Object.keys(scores[judgeId][participantId]).length;
        } else {
          finalScores[judgeId][participantId] = Object.keys(
            scores[judgeId][participantId]
          ).reduce(
            (acc, danceId) =>
              Math.max(acc, scores[judgeId][participantId][danceId]),
            0
          );
        }
      }
    }

    return finalScores;
  }

  _unflattenJudgeScore(notes: Array<JudgeNote>): MapJudgeScoreUnflatten {
    /*
    Unflatten the judge notes array into
    a easier structure to use for extracting placement
    */
    let totals: MapJudgeScoreUnflatten = {};
    const dances: Array<Dance> = this._getDances();

    notes
      .filter(note => {
        const judge: ?Judge = this._judges.find(
          judge => judge.id == note.judgeId
        );
        return judge != null;
      })
      .filter(note => {
        return note.danceId in dances;
      })
      .forEach(note => {
        if (totals[note.judgeId] === undefined) {
          totals[note.judgeId] = {};
        }
        if (totals[note.judgeId][note.participantId] == undefined) {
          totals[note.judgeId][note.participantId] = {};
        }
        if (
          totals[note.judgeId][note.participantId][note.danceId] == undefined
        ) {
          totals[note.judgeId][note.participantId][note.danceId] = 0;
        }

        totals[note.judgeId][note.participantId][note.danceId] += note.value;
      });

    return totals;
  }

  _computeSanctions(unflattenScores: MapJudgeScoreUnflatten): SanctionMap {
    let sanctions: SanctionMap = {};
    const maxScoreForParticipants = this._maxScoreForParticipants();

    /*
      Retrieve the sanctionner judges
    */
    const sanctionnerIds = Object.keys(unflattenScores).filter(judgeId => {
      const judge: ?Judge = this._judges.find(judge => judge.id === judgeId);
      return judge != null && judge.judgeType === 'sanctioner';
    });

    /*
      Combine the sanction of all the sanctionner judges
    */
    for (const sanctionnerId of sanctionnerIds) {
      const sanctionnerScores = Object.keys(unflattenScores[sanctionnerId]);
      for (const participantId of sanctionnerScores) {
        const sanctionParticipant = Object.keys(
          unflattenScores[sanctionnerId][participantId]
        );
        if (sanctions[participantId] === undefined) {
          sanctions[participantId] = {};
        }

        for (const danceId of sanctionParticipant) {
          const sanction_value =
            unflattenScores[sanctionnerId][participantId][danceId];
          if (sanctions[participantId][danceId] === undefined) {
            sanctions[participantId][danceId] = this._malusFromValueAndMaxScore(
              sanction_value,
              maxScoreForParticipants
            );
          } else {
            sanctions[participantId][
              danceId
            ] += this._malusFromValueAndMaxScore(
              sanction_value,
              maxScoreForParticipants
            );
          }
        }
      }
    }

    return sanctions;
  }

  _applyNegativScores(
    unflattenScores: MapJudgeScoreUnflatten,
    sanctions: SanctionMap
  ): MapJudgeScoreUnflatten {
    let finalScores: MapJudgeScoreUnflatten = {};

    Object.keys(unflattenScores)
      .filter(judgeId => {
        const judge: ?Judge = this._judges.find(judge => judge.id === judgeId);
        return judge != null && this._isPositiveJudgeType(judge.judgeType);
      })
      .forEach(judgeId => {
        finalScores[judgeId] = {};

        for (const participantId of Object.keys(unflattenScores[judgeId])) {
          finalScores[judgeId][participantId] = {};
          const participantDances = unflattenScores[judgeId][participantId];
          for (const danceId of Object.keys(participantDances)) {
            if (
              sanctions[participantId] === undefined ||
              sanctions[participantId][danceId] === undefined
            ) {
              finalScores[judgeId][participantId][danceId] = this._sum(
                participantDances[danceId],
                0
              );
            } else {
              finalScores[judgeId][participantId][danceId] = this._sum(
                participantDances[danceId],
                sanctions[participantId][danceId]
              );
            }
          }
        }
      });

    return finalScores;
  }

  _maxScoreForParticipants() {
    const criteriaForPositiveJudges = Object.keys(this._criteria)
      .map(key => this._criteria[key])
      .filter(({ forJudgeType }) => this._isPositiveJudgeType(forJudgeType));

    const positiveJudges = this._judges.filter(({ judgeType }) =>
      this._isPositiveJudgeType(judgeType)
    );

    return (
      criteriaForPositiveJudges.reduce(
        (acc, { maxValue }) => acc + maxValue,
        0
      ) * positiveJudges.length
    );
  }

  _malusFromValueAndMaxScore(value: number, maxScore: number): number {
    const score = maxScore * (1 - (100 - value) / 100);
    const rounded = parseFloat(score.toFixed(2));
    return rounded;
  }

  _isPositiveJudgeType(judgeType: JudgeType): boolean {
    return (
      judgeType === 'normal' ||
      (this._countPresident === true && judgeType === 'president')
    );
  }

  _sum(positive: number, negative: number): number {
    return this._allowNegative === true
      ? (positive || 0) - (negative || 0)
      : Math.max((positive || 0) - (negative || 0), 0);
  }

  _getDances(): Array<Dance> {
    let dances: Array<Dance> = [];

    this._round.groups.forEach(g => {
      dances = [...dances, ...g.dances];
    });

    return dances;
  }

  _getRoleParticipant(role: ParticipantRole): Array<string> {
    return this._round.groups.reduce(
      (pairs, group) => [
        ...pairs,
        ...group.pairs.reduce((acc, pair) => {
          const arr = [];
          if (pair.follower != null && role == 'follower') {
            arr.push(pair.follower);
          }
          if (pair.leader != null && role == 'leader') {
            arr.push(pair.follower);
          }
          return [...acc, ...arr];
        }, [])
      ],
      []
    );
  }

  _getParticipants(): Array<string> {
    return this._round.groups.reduce(
      (pairs, group) => [
        ...pairs,
        ...group.pairs.reduce((acc, pair) => {
          const arr = [];
          if (pair.follower != null) {
            arr.push(pair.follower);
          }
          if (pair.leader != null) {
            arr.push(pair.leader);
          }
          return [...acc, ...arr];
        }, [])
      ],
      []
    );
  }

  _sortScore(a: Score, b: Score): number {
    if (a.score == b.score) {
      return 1;
    }
    return b.score - a.score;
  }

  _sortPlacements(a: ParticipantStats, b: ParticipantStats): number {
    // /!\ There is a bias in the sum if there is a missing judge
    // for one of the participant
    if (a.min_rank !== b.min_rank) {
      // a.min_rank < b.min_rank => _sortPlacement < 0
      return a.min_rank - b.min_rank;
    }
    // Same rank for majority
    if (a.majority_amount !== b.majority_amount) {
      // a.majority_amount > b.majority_amount => _sortPlacement < 0
      return b.majority_amount - a.majority_amount;
    }

    // Same amount of judge for majority, starting tie-breaking decisions
    // NB : Same amount of sums_rank so we can iterate only on the indexes
    // of one and compare index by index
    for (let index of a.sums_rank.keys()) {
      if (a.sums_rank[index] !== b.sums_rank[index]) {
        // a.sums_rank[index] < b.sums_rank[index] => _sortPlacement < 0
        return a.sums_rank[index] - b.sums_rank[index];
      }
    }

    // Same sum of ranks for every range of position past the majority
    // Performing all judge relative placement tie-break

    // The judge where A is 'over'/'below' B in terms of ranking
    let judge_over: number = 0;
    let judge_below: number = 0;
    const max_rank = a.sums_rank.length + a.min_rank;

    for (let judgeId of Object.keys(a.judgeScores)) {
      // We remove the judge that were not ranking both
      // Should not happen
      if (
        a.judgeScores[judgeId] !== max_rank &&
        b.judgeScores[judgeId] !== max_rank
      ) {
        if (a.judgeScores[judgeId] > b.judgeScores[judgeId]) {
          judge_over += 1;
        } else if (a.judgeScores[judgeId] < b.judgeScores[judgeId]) {
          judge_below += 1;
        }
      }
    }

    // judge_over < judge_below => _sortPlacement < 0
    return judge_over - judge_below;
  }

  // Generate an array to iterate containing
  // all the numbers from 'from' to 'to' exlusive
  _range(from: number, to: number): Array<number> {
    return [...Array(to - from).keys()].map(n => n + from);
  }
}
