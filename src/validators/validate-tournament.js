// @flow

const validateTournament = (
  tournament: Tournament,
): TournamentValidationSummary => {
  const isValidName = tournament.name !== '';
  const isValidType = tournament.type === 'jj' || tournament.type === 'classic';
  const isValidDate = !tournament.date.isSame(0);

  const isValidTournament = isValidName && isValidType && isValidDate;
  return {
    isValidTournament,
    isValidName,
    isValidDate,
    isValidType,
  };
};

export default validateTournament;
