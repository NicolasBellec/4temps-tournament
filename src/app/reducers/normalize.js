// @flow
import { normalize, schema } from 'normalizr';

const roundSchema = new schema.Entity('rounds');
const participantSchema = new schema.Entity('participants');
const judgeSchema = new schema.Entity('judges');
const assistantSchema = new schema.Entity('assistants');

const tournamentSchema = new schema.Entity('tournaments', {
  judges: [judgeSchema],
  assistants: [assistantSchema],
  participants: [participantSchema],
  rounds: [roundSchema],
});

type Collections = {
  tournaments: {
    [string]: {
      ...Tournament,
      judges: string[],
      assistants: string[],
      participants: string[],
      rounds: string[]
    }
   },
  judges: { [string]: Judge },
  assistants:  { [string]: Assistant },
  participants: { [string]: Participant },
  rounds: { [string]: Round }
};

type Result = string;

type NormalizeResult<Result, Collections> = {|
  result: Result,
  entities: Collections,
|}

export function normalizeTournament(tournament: Tournament): NormalizeResult<Result, Collections> {
  return normalize(tournament, tournamentSchema);
}

export function normalizeTournamentArray(
  tournaments: Array<Tournament>,
): NormalizeResult<Result[], Collections> {
  return normalize(tournaments, [tournamentSchema]);
}
