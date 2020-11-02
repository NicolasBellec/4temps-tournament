// no-flow

export type JudgeWeightedNote = {
  judgeId: string,
  participantId: string,
  score: number,
};

export type JudgeScore = {
  judgeId: string,
  participantId: string,
  danceId: string,
  score: number,
};

export type JudgeRank = {
  ...JudgeWeightedNote,
  rank: number,
};

export type RankMatrixRow = {
  participantId: string,
  row: Array<number>,
  rankReachMajority: number, // this is the index the rank being + 1
  sumsRanks: Array<number>,
  ranks: Array<JudgeRank>,
};

export type RankMatrix = Array<RankMatrixRow>;

export default class RPSSRoundScorer {
  _judges: Array<Judge>;

  _round: Round;

  _criteria: {
    [id: string]: RoundCriterion,
  };

  _countPresident: boolean;

  _allowNegative: boolean;

  _debug: boolean;

  constructor(
    judges: Array<Judge>,
    round: Round,
    {
      countPresident,
      allowNegative,
    }: {
      countPresident: boolean,
      allowNegative: boolean,
    } = {
      countPresident: false,
      allowNegative: false,
    },
    debug: boolean = false,
  ) {
    this._judges = judges;
    this._criteria = round.criteria.reduce(
      (acc, crit) => ({
        ...acc,
        [crit.id]: crit,
      }),
      {},
    );
    this._round = round;
    this._countPresident = countPresident;
    this._allowNegative = allowNegative;
    this._debug = debug;
  } // constructor

  scoreRound(notes: Array<JudgeNote>): Array<Score> {
    /*
      Transform the individual notes into a global ranking of the participant
    */
    const ranks: Array<JudgeRank> = this._genJudgeRanks(notes);

    const ranking_leader: Array<Score> = this._genRPSSRanking(ranks, 'leader');

    const ranking_follower: Array<Score> = this._genRPSSRanking(
      ranks,
      'follower',
    );

    return [...ranking_leader, ...ranking_follower];
  } // scoreRound

  _genRPSSRanking(
    ranks: Array<JudgeRank>,
    role: ParticipantRole,
  ): Array<Score> {
    /*
      Transform the ranking of each judge in a ranking for the given role
    */

    // First compute some useful constant (majority threshold, ...)
    const positivJudges: Array<Judge> = this._judges.filter((judge) => this._isPositiveJudgeType(judge.judgeType));

    const judgeMajority = Math.ceil(positivJudges.length / 2);
    const participants: Array<string> = this._getRoleParticipant(role);

    const max_rank: number = participants.length;

    const roleRanks: Array<JudgeRank> = ranks.filter((ranks) => participants.includes(ranks.participantId));

    // Generate the rank matrix
    // PS: Also contains some data in each row that help sorting the participants
    const rankMatrix: RankMatrix = this._genRankMatrix(
      participants,
      roleRanks,
      judgeMajority,
    );

    const sortedRankMatrix: RankMatrix = rankMatrix.sort(
      this._RPSScompare.bind(this),
    );

    const finalRank: Array<Score> = this._genScoresFromSortedRankMatrix(
      sortedRankMatrix,
      max_rank,
    );

    return finalRank;
  } // _genRPSSRanking

  _genScoresFromSortedRankMatrix(
    rm: RankMatrix,
    max_rank: number,
  ): Array<Score> {
    let cur_rank: number = max_rank;

    if (rm.length === 0) {
      return [];
    }

    const scores: Array<Score> = [
      {
        participantId: rm[0].participantId,
        score: cur_rank,
      },
    ];

    for (let index = 1; index < rm.length; index++) {
      // If the rank must be incremented
      if (this._RPSScompare(rm[index - 1], rm[index]) != 0) {
        cur_rank = max_rank - index;
      }

      scores.push({
        participantId: rm[index].participantId,
        score: cur_rank,
      });
    }

    return scores;
  } // _genScoresFromSortedRankMatrix

  _RPSScompare(rowA: RankMatrixRow, rowB: RankMatrixRow): number {
    /*
      Compare 2 participants according to RPSS rules in order to sort them
      If rowA is better than rowB, then _RPSScompare(rowA,rowB) < 0
      If rowB is better than rowA, then _RPSScompare(rowA,rowB) > 0
    */

    // Have the two participant reached the majority at the same rank ?
    if (rowA.rankReachMajority != rowB.rankReachMajority) {
      return rowA.rankReachMajority - rowB.rankReachMajority;
    }

    // Have the two participant the same number of vote once majority reached ?
    if (rowA.row[rowA.rankReachMajority] != rowB.row[rowB.rankReachMajority]) {
      return (
        rowB.row[rowB.rankReachMajority] - rowA.row[rowA.rankReachMajority]
      );
    }

    // Have the participant the same quality of vote for the majority rank ?
    if (
      rowA.sumsRanks[rowA.rankReachMajority]
      != rowB.sumsRanks[rowB.rankReachMajority]
    ) {
      return (
        rowA.sumsRanks[rowA.rankReachMajority]
        - rowB.sumsRanks[rowB.rankReachMajority]
      );
    }

    // Have the participant the same quality of vote for each rank ?
    // NB : As they already have the same sum, the first one that has its sum
    // change mean that it has 1 vote more than the other and thus, we search the
    // highest and not the lowest
    for (
      let index = rowA.rankReachMajority + 1;
      index < rowA.row.length;
      index++
    ) {
      if (rowA.sumsRanks[index] != rowB.sumsRanks[index]) {
        return rowB.sumsRanks[index] - rowA.sumsRanks[index];
      }
    }

    // We could not segregate by looking at global data, we analyse the rank
    // judge by judge to find a difference

    let judgeForA: number = 0;
    let judgeForB: number = 0;
    const positivJudges: Array<Judge> = this._judges.filter((judge) => this._isPositiveJudgeType(judge.judgeType));

    positivJudges.forEach((judge) => {
      const rankA: ?JudgeRank = rowA.ranks.find(
        (rank) => rank.judgeId === judge.id,
      );
      const rankB: ?JudgeRank = rowB.ranks.find(
        (rank) => rank.judgeId === judge.id,
      );

      if (rankA != null && rankB != null) {
        if (rankA.rank < rankB.rank) {
          judgeForA++;
        } else if (rankA.rank > rankB.rank) {
          judgeForB++;
        }
      }
    });

    return judgeForB - judgeForA;
  } // _RPSScompare

  _genRankMatrixRow(
    participantId: string,
    maxRank: number,
    judgeMajority: number,
    ranks: Array<JudgeRank>,
  ): RankMatrixRow {
    /*
      Generate the row and a few stats for the ranking matrix in order to ease
      the sorting algorithm
    */

    const participantRanks: Array<JudgeRank> = ranks.filter(
      (rank) => rank.participantId === participantId,
    );

    // The ranks are [1...maxRank] and not [0...maxRank[ so we need to map
    // add 1 to the rank
    const votePerRank: Array<number> = [...Array(maxRank).keys()]
      .map((cur_rank) => cur_rank + 1)
      .map((cur_rank) => {
        const votes: Array<JudgeRank> = participantRanks.filter(
          (rank) => rank.rank === cur_rank,
        );
        return votes.length;
      });

    // Same
    const row: Array<number> = [...Array(maxRank).keys()]
      .map((cur_rank) => cur_rank + 1)
      .map((cur_rank) => {
        const votes: Array<JudgeRank> = participantRanks.filter(
          (rank) => rank.rank <= cur_rank,
        );
        return votes.length;
      });

    const rankReachMajority: number = row.reduce((acc, nbVote, index) => {
      if (acc != -1) {
        return acc;
      } if (nbVote >= judgeMajority) {
        // We keep the index instead of the rank that is index + 1 as
        // this is used to access the row table
        return index;
      }
      return -1;
    }, -1);

    const sumsRanks: Array<number> = [...votePerRank.keys()].map((max_rank) => votePerRank
      .slice(0, max_rank + 1)
      .reduce((acc, nbVote, cur_rank) => acc + nbVote * (cur_rank + 1), 0)); // end max_rank

    return {
      participantId,
      row,
      rankReachMajority,
      sumsRanks,
      ranks: participantRanks,
    };
  } // _genRankMatrixRow

  _genRankMatrix(
    participants: Array<string>,
    ranks: Array<JudgeRank>,
    judgeMajority: number,
  ): RankMatrix {
    /*
      Generate the ranking matrix for each participant
    */
    const max_rank: number = participants.length;
    return participants.map((participantId) => this._genRankMatrixRow(participantId, max_rank, judgeMajority, ranks));
  } // _genRankMatrix

  _genJudgeRanks(notes: Array<JudgeNote>): Array<JudgeRank> {
    /*
      Generate the ranking of each candidate for each judge
    */

    // Compute the finale score of the candidates for each judge
    const weightedNotes: JudgeWeightedNote[] = this._computeJudgeWeightedNotes(
      notes,
    );

    const followerIds: Array<string> = this._getRoleParticipant('follower');
    const leaderIds: Array<string> = this._getRoleParticipant('leader');

    // Sort the score for each judge in order to obtain a ranking
    const judgeRanks: Array<JudgeRank> = this._judges
      .filter((judge) => this._isPositiveJudgeType(judge.judgeType))
      .reduce((acc, judge) => {
        const weighted: Array<JudgeWeightedNote> = weightedNotes.filter(
          (notes) => judge.id === notes.judgeId,
        );

        // Segregate leaders from followers to have 2 distinct rankings
        const leaderWeighted: Array<JudgeWeightedNote> = weighted.filter(
          (note) => {
            const participant: ?string = leaderIds.find(
              (leaderId) => leaderId === note.participantId,
            );
            return participant != null;
          },
        );

        const followerWeighted: Array<JudgeWeightedNote> = weighted.filter(
          (note) => {
            const participant: ?string = followerIds.find(
              (followerId) => followerId === note.participantId,
            );
            return participant != null;
          },
        );

        const leaderRanks: JudgeRank[] = this._genRanksFromWeightedScores(
          leaderWeighted,
        );
        const followerRanks: JudgeRank[] = this._genRanksFromWeightedScores(
          followerWeighted,
        );

        return [...acc, ...leaderRanks, ...followerRanks];
      }, []);

    return judgeRanks;
  } // _genJudgeRanks

  _genRanksFromWeightedScores(
    weightedScores: Array<JudgeWeightedNote>,
  ): Array<JudgeRank> {
    /*
      Transforms the weightedNotes of one judge into a ranking of this judge
    */
    // Check coherance
    if (weightedScores.length != 0) {
      const { judgeId } = weightedScores[0];
      weightedScores.forEach((score) => {
        if (score.judgeId != judgeId) {
          throw '_genRanksFromWeightedScores : judge ids are not all the same';
        }
      });
    }

    const sorted: Array<JudgeWeightedNote> = weightedScores.sort(
      (a, b) => b.score - a.score,
    );

    const ranks: Array<JudgeRank> = [];

    let current_rank: number = 0;
    let shadow_rank: number = 0;
    let current_score: ?number = null;

    for (const note of sorted) {
      shadow_rank++;

      if (current_score === null) {
        current_rank++;
        current_score = note.score;
      } else if (current_score != null && note.score < current_score) {
        current_rank = shadow_rank;
        current_score = note.score;
      }

      ranks.push({
        judgeId: note.judgeId,
        participantId: note.participantId,
        score: current_score,
        rank: current_rank,
      });
    } // score

    return ranks;
  } // _genRanksFromWeightedScores

  _computeJudgeWeightedNotes(
    notes: Array<JudgeNote>,
  ): Array<JudgeWeightedNote> {
    /*
      Aggregate the scores of each judge by summing criterias and applying penalties
      for each dance, then weight the final score according to the MultipleDanceScoringRule.
    */
    const danceIds: Array<string> = this._getDances().map((dance) => dance.id);
    const participantIds: Array<string> = this._getParticipants();

    return participantIds.reduce((scoreAcc, participantId) => {
      // Aggregate all the judge scores for this participant, one score per
      // dance and per judge
      const scoresForParticipant: JudgeScore[] = danceIds.reduce(
        (acc, danceId) => {
          const aggregatedDanceNotes: JudgeScore[] = this._aggregateDanceNotes(
            notes,
            participantId,
            danceId,
          );

          return [...acc, ...aggregatedDanceNotes];
        },
        [],
      ); // danceIds

      // Aggregate all the score of the same judge as according to the
      // weighting rule
      const weightedScores: Array<JudgeWeightedNote> = this._aggregateJudgeNote(
        scoresForParticipant,
        participantId,
      );

      return [...scoreAcc, ...weightedScores];
    }, []); // participantIds
  } // _computeJudgeWeightedNotes

  _aggregateDanceNotes(
    notes: Array<JudgeNote>,
    participantId: string,
    danceId: string,
  ): Array<JudgeScore> {
    /*
      Aggregate all the notes given by the judges for a given dance
      into one note per judge, with added penalty
      This is done by:
      1) regrouping all the notes given by one judge for the participant;
      2) computing the penalty associated to this participant for this dance;
      3) apply the penalty according to the penalty rule.
    */

    const maxScore: number = this._getMaxScore();

    // For each judge, aggregate its notes for the dance and the candidate
    const aggregatedDanceNotes: Array<JudgeScore> = this._judges.reduce(
      (acc, judge) => {
        const selectedNotes: Array<JudgeNote> = notes.filter(
          (note) => note.judgeId === judge.id
            && note.participantId === participantId
            && note.danceId === danceId,
        );

        // Case where the participant is not in the dance for example
        if (selectedNotes.length === 0) {
          return acc;
        }

        const aggregatedJudgeNote: number = selectedNotes.reduce(
          (acc, note) => acc + note.value,
          0,
        );

        return [
          ...acc,
          {
            judgeId: judge.id,
            participantId,
            danceId,
            score: aggregatedJudgeNote,
          },
        ];
      },
      [],
    );

    // Compute the penalty for this dance and this candidate
    const aggregatedPenaltyValue: number = aggregatedDanceNotes
      .filter((note) => {
        const judge: ?Judge = this._judges.find(
          (judge) => judge.id === note.judgeId,
        );
        return judge != null && judge.judgeType === 'sanctioner';
      })
      .reduce((penalty, penaltyNote) => penalty + penaltyNote.score, 0);

    const penaltyScore: number = this._computePenalty(
      aggregatedPenaltyValue,
      maxScore,
    );

    // Apply the penalty to each judge note and return the result
    return aggregatedDanceNotes
      .filter((note) => {
        const judge: ?Judge = this._judges.find(
          (judge) => judge.id === note.judgeId,
        );
        return judge != null && this._isPositiveJudgeType(judge.judgeType);
      })
      .map((judgeScore) => ({
        ...judgeScore,
        score: this._sumPenalty(judgeScore.score, penaltyScore),
      }));
  } // _aggregateDanceScore

  _aggregateJudgeNote(
    scoreForParticipant: Array<JudgeScore>,
    participantId: string,
  ): Array<JudgeWeightedNote> {
    /*
      Transform the multiple JudgeScore for one participant into the
      final score of each judge
    */

    return this._judges
      .filter((judge) => this._isPositiveJudgeType(judge.judgeType))
      .reduce((accWeightedNotes, judge) => {
        const scoresJudge: Array<JudgeScore> = scoreForParticipant.filter(
          (score) => score.judgeId === judge.id,
        );

        return [
          ...accWeightedNotes,
          {
            score: this._computeMultipleDanceScore(scoresJudge),
            participantId,
            judgeId: judge.id,
          },
        ];
      }, []);
  } // _aggregateJudgeNote

  _computeMultipleDanceScore(scoreJudge: Array<JudgeScore>): number {
    /*
      Aggregate the scores of one judge in function of the multipleDanceScoringRule
    */

    // Small check before use
    if (scoreJudge.length > 0) {
      const { judgeId } = scoreJudge[0];
      const { participantId } = scoreJudge[0];
      scoreJudge.forEach((score) => {
        if (score.judgeId != judgeId) {
          throw 'Not all scores have the same judgeId';
        }
        if (score.participantId != participantId) {
          throw 'Not all scores have the same participantId';
        }
      });
    } // Checks

    if (this._round.multipleDanceScoringRule === 'average') {
      const score: number = (scoreJudge.reduce((acc, score) => acc + score.score, 0) * 1.0)
        / scoreJudge.length;
      return parseFloat(score.toFixed(2));
    } // 'average'
    if (this._round.multipleDanceScoringRule === 'best') {
      return scoreJudge.reduce((acc, score) => Math.max(acc, score.score), 0);
    } // 'best'

    throw 'Using undefined multipleDanceScoringRule';
  } // _computeMultipleDanceScore

  _getMaxScore(): number {
    /*
      Compute the maximal score a judge can give to a participant
    */

    // NB: Used Object.keys for flow comprehension
    return Object.keys(this._criteria)
      .map((key) => this._criteria[key])
      .filter(({ forJudgeType }) => this._isPositiveJudgeType(forJudgeType))
      .reduce((acc, criteria) => acc + criteria.maxValue, 0);
  } // _getMaxScore

  _computePenalty(value: number, maxScore: number): number {
    const score = maxScore * (value / 100);
    const rounded = parseFloat(score.toFixed(2));
    return rounded;
  } // _computePenalty

  _getDances(): Array<Dance> {
    return this._round.groups.reduce(
      (dances, g) => [...dances, ...g.dances],
      [],
    );
  } // _getDances

  _getParticipants(): Array<string> {
    /*
      Return an array of all the participantIds that danced in the round
    */
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
        }, []),
      ],
      [],
    );
  } // _getParticipants

  _getRoleParticipant(role: ParticipantRole): Array<string> {
    /*
      Returns an array of participantId of the given role that danced
      in the round
    */
    return this._round.groups.reduce(
      (pairs, group) => [
        ...pairs,
        ...group.pairs.reduce((acc, pair) => {
          const arr = [];
          if (pair.follower != null && role == 'follower') {
            arr.push(pair.follower);
          }
          if (pair.leader != null && role == 'leader') {
            arr.push(pair.leader);
          }
          return [...acc, ...arr];
        }, []),
      ],
      [],
    );
  } // _getRoleParticipant

  _isPositiveJudgeType(judgeType: JudgeType): boolean {
    return (
      judgeType === 'normal'
      || (this._countPresident === true && judgeType === 'president')
    );
  } // _isPositiveJudgeType

  _sumPenalty(positive: number, negative: number): number {
    return this._allowNegative === true
      ? (positive || 0) - (negative || 0)
      : Math.max((positive || 0) - (negative || 0), 0);
  } // _sumPenalty
} // RPSSRoundScorer
