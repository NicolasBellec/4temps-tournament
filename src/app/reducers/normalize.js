// no-flow
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

export function normalizeTournament(tournament: Tournament): mixed {
  return normalize(tournament, tournamentSchema);
}

export function normalizeTournamentArray(tournaments: Array<Tournament>): Array<mixed> {
  return normalize(tournaments, [tournamentSchema]);
}
