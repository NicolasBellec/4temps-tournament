// @flow

import DanceScorer from './dance-scorer';

type Score = {
  participantId: string,
  score: number
}

type Placement = {
  participantId: string,
  score: number,
  placement: number
}

type JudgePlacement = Array<Placement>

type MapJudgePlacement = {
  [judgeId: string]: JudgePlacement
}

type SeparatedPlacement = {
  leader : MapJudgePlacement,
  follower : MapJudgePlacement
}

type MapJudgeScoreUnflatten = {
  [ judgeId: string ] : {
    [ participantId: string ] : {
      [ danceId: string ] : number
    }
  }
}

type MapJudgeParticipantScore = {
  [ judgeId: string ] : {
    [ participantId: string ] : number
  }
}

type ParticipantRank = {
  [ participantId : string ] : Array<number>
}

type SanctionMap = {
  [ participantId: string ] : {
    [ danceId : string ] : number
  }
}

type Ranking = Array<string>

export default class RPSSRoundScorer {
  _judges: Array<Judge>;
  _round: Round;
  _criteria: { [id: string]: RoundCriterion };
  _countPresident: boolean;
  _allowNegative: boolean

  constructor(
    judges: Array<Judge>,
    round: Round,
    { countPresident, allowNegative }: {
      countPresident: boolean,
      allowNegative: boolean
    }
      = { countPresident: false, allowNegative: false }
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

  scoreRound = (
    notes: Array<JudgeNote>
  ): Array<Score> => {
    const placements : SeparatedPlacement =
      this._transformToPlacement( notes );
    const leader_ranking: Ranking = this._genRanking( placements.leader, 'leader' );
    const follower_ranking: Ranking = this._genRanking( placements.follower, 'follower' );

    return [];
  }

  _genRanking = (
    placements : MapJudgePlacement,
    role : ParticipantRole
  ) : Ranking => {
    var ranking : Ranking = [];

    const participants = _getRoleParticipant( role );
    const mapParticipant : {
      [participantId: string] : Array<number>
    } = participants.reduce( (acc, participantId) => {
      ...acc,
      participantId = Object.keys(placement).map(
        judgeId => {
          const place : ?Placement = placement[judgeId].find(
            el => el.participantId === participantId
          )
          return place != null ? place.placement : -1;
        }
      )
    }, {});

    judgeMajority = Math.ceil(this._judges.length / 2);

    for ( var i = 1; i < participant.length + 1; ) {
      majorityParticipant = participants.filter( participantId => {
        const judgeVotes = mapParticipant[participantId].filter(
          rank => rank <= i
        ).length;
        return !ranking.includes(participantId) && majority >= judgeMajority
      });

      if ( majorityParticipant.length > 1 ) {
        // Multiple majority vote
        TODO
      }
      elseif ( majorityParticipant.length === 0 ) {
        // No majority vote
        TODO
      }
      else {
        // Only one majority vote
      }

      i++;
    }

    return ranking
  };

  _transformToPlacement = (
    notes: Array<JudgeNote>
  ): SeparatedPlacement => {
    /*
      1) Recover the note for each judge for each dance
      2) Apply the sanction on each judge note
      3) Sort for each judge on the final score
    */
    const unflattenScore: MapJudgeScoreUnflatten = this._unflattenJudgeScore( notes );
    const sanctionScores: SanctionMap = this._computeSanctions( unflattenScore );
    const summedScores: MapJudgeScoreUnflatten = this._applyNegativScores(
                                                  unflattenScore, sanctionScores );
    const finalScores: MapJudgeParticipantScore = this._scoreFromDanceRule( summedScores );

    //NOTE: Does not handle leaderAndFollower, should not happen.
    const leader_ranking : MapJudgePlacement = this._generateRolePlacement( finalScores, sanctionScores, 'leader' );
    const follower_ranking : MapJudgePlacement = this._generateRolePlacement( finalScores, sanctionScores, 'follower' );

    return { leader: leader_ranking, follower: follower_ranking};
  }

  _generateRolePlacement = (
    scores : MapJudgeParticipantScore,
    sanctionScores : SanctionMap,
    role : ParticipantRole
  ) : MapJudgePlacement => {
    let placement: MapJudgePlacement = {};
    const roleParticipant : Array<string> = this._getRoleParticipant( role );

    for ( const judgeId of Object.keys(scores) ) {
      placement[judgeId] = Object.keys(scores[judgeId])
        .filter( participantId => {
          roleParticipant.includes(participantId)
        })
        .map( participantId => ({
          participantId: participantId,
          score: scores[judgeId][participantId]
        }))
        .sort(this._sort)
        .map( score => ({
            ...score,
            placement: 0
        }));

      var current_place = 1;
      var current_score = placement[judgeId][0].score;
      for ( var i = 0; i < placement[judgeId].length; i++ ) {
        if ( placement[judgeId][i].score !== current_score ) {
          current_place = i+1;
          current_score = placement[judgeId][i].score;
        }
        placement[judgeId][i].placement = current_place;
      }
    }

    return placement;
  };

  _scoreFromDanceRule = (
    scores : MapJudgeScoreUnflatten
  ) : MapJudgeParticipantScore => {
    let finalScores: MapJudgeParticipantScore = {};

    for ( const judgeId of Object.keys(scores) ) {
      finalScores[judgeId] = {};

      for ( const participantId of Object.keys(scores[judgeId]) ) {
        if ( this._round.danceScoringRule === 'average' ) {
          finalScores[judgeId][participantId] =
            (Object.keys(scores[judgeId][participantId]).reduce( (acc, danceId) =>
              acc + scores[judgeId][participantId][danceId], 0) * 1.0)
              / Object.keys(scores[judgeId][participantId]).length;
        }
        else {
          finalScores[judgeId][participantId] =
          Object.keys(scores[judgeId][participantId]).reduce( (acc, danceId) =>
            Math.max(acc,scores[judgeId][participantId][danceId]), 0);
        }
      }
    }

    return finalScores;
  };

  _unflattenJudgeScore = (
    notes: Array<JudgeNote>
  ): MapJudgeScoreUnflatten => {
    /*
    Unflatten the judge notes array into
    a easier structure to use for extracting placement
    */
    let totals: MapJudgeScoreUnflatten = {};
    const dances: Array<Dance> = this._getDances();

    notes.filter( note => {
      const judge: ?Judge = this._judges.find(
        judge => judge.id == note.judgeId
      );
      return judge != null;
    }).filter( note => {
      return note.danceId in dances;
    }).forEach( note => {
      if ( totals[note.judgeId] === undefined ) {
        totals[note.judgeId] = { };
      }
      if ( totals[note.judgeId][note.participantId] == undefined ) {
        totals[note.judgeId][note.participantId] = { };
      }
      if ( totals[note.judgeId][note.participantId][note.danceId] == undefined ) {
        totals[note.judgeId][note.participantId][note.danceId] = 0;
      }

      totals[note.judgeId][note.participantId][note.danceId] += note.value;
    });

    return totals;
  }

  _computeSanctions = (
    unflattenScores: MapJudgeScoreUnflatten
  ): SanctionMap => {
    let sanctions: SanctionMap = {};
    const maxScoreForParticipants = this._maxScoreForParticipants();

    /*
      Retrieve the sanctionner judges
    */
    const sanctionnerIds = Object.keys(unflattenScores).filter(
      judgeId => {
        const judge: ?Judge = this._judges.find(
          judge => judge.id === judgeId
        );
        return judge != null && judge.judgeType === 'sanctioner';
      }
    );

    /*
      Combine the sanction of all the sanctionner judges
    */
    for ( const sanctionnerId of sanctionnerIds ) {
      const sanctionnerScores = Object.keys(unflattenScores[sanctionnerId]);
      for ( const participantId of sanctionnerScores ) {
        const sanctionParticipant = Object.keys(
                                  unflattenScores[sanctionnerId][participantId]);
        if ( sanctions[participantId] === undefined ) {
          sanctions[participantId] = {};
        }

        for ( const danceId of sanctionParticipant ) {
          const sanction_value = unflattenScores[sanctionnerId][participantId][danceId];
          if ( sanctions[participantId][danceId] === undefined ) {
            sanctions[participantId][danceId] =
                this._malusFromValueAndMaxScore(sanction_value, maxScoreForParticipants);
          }
          else {
            sanctions[participantId][danceId] +=
                this._malusFromValueAndMaxScore(sanction_value, maxScoreForParticipants);
          }
        }
      }
    }

    return sanctions;
  };

  _applyNegativScores = (
    unflattenScores: MapJudgeScoreUnflatten,
    sanctions : SanctionMap
  ): MapJudgeScoreUnflatten => {
    let finalScores: MapJudgeScoreUnflatten = {};

    Object.keys(unflattenScores).filter( judgeId => {
        const judge: ?Judge = this._judges.find(
          judge => judge.id === judgeId
        );
        return judge != null && this._isPositiveJudgeType(judge.judgeType);
      }
    ).forEach(
      judgeId => {
        finalScores[judgeId] = {};

        for (const participantId of Object.keys(unflattenScores[judgeId])) {
          finalScores[judgeId][participantId] = {};
          const participantDances = unflattenScores[judgeId][participantId];
          for ( const danceId of Object.keys(participantDances) ) {
            if ( sanctions[participantId] === undefined ||
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
      }
    );

    return finalScores;
  };

  _maxScoreForParticipants = () => {
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
  };

  _malusFromValueAndMaxScore = (value: number, maxScore: number) => {
    const score = maxScore * (1 - (100 - value) / 100);
    const rounded = parseFloat(score.toFixed(2));
    return rounded;
  };

  _isPositiveJudgeType = (judgeType: JudgeType): boolean => {
    return (
      judgeType === 'normal' ||
      (this._countPresident === true && judgeType === 'president')
    );
  };

  _sum = (
    positive: number,
    negative: number
  ): number => {
      return this._allowNegative === true
        ? (positive || 0) - (negative || 0)
        : Math.max((positive || 0) - (negative || 0), 0);
  };

  _getDances = (): Array<Dance> => {
    let dances: Array<Dance> = [];

    this._round.groups.forEach(g => {
      dances = [...dances, ...g.dances];
    });

    return dances;
  };

  _getRoleParticipant = (
    role : ParticipantRole
  ) : Array<string> => {
    return this._round.groups.reduce(
      (pairs, group) => [
        ...pairs,
        ...group.pairs.reduce((acc, pair) => {
          const arr = [];
          if ( pair.follower != null && role == 'follower') {
            arr.push( pair.follower );
          }
          if ( pair.leader != null && role == 'leader') {
            arr.push( pair.follower );
          }
          return [...acc, ...arr];
      }, [])
      ],
      []
    );
  };

  _getParticipants = (): Array<string> => {
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
  };

  _sort = (a: Score, b: Score) => {
    if (a.score == b.score) {
      return 1;
    }
    return b.score - a.score;
  };
}
