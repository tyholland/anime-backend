const mysql = require('../../utils/mysql').instance();

module.exports.getMatchup = async (req, res) => {
  const { matchup_id } = req.params;

  try {
    const matchup = await mysql('SELECT * FROM matchup WHERE id = ?', [
      matchup_id,
    ]);

    return res.status(200).json(matchup);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get Matchup',
    });
  }
};

module.exports.getMatchupFromTeam = async (req, res) => {
  const { team_id } = req.params;

  try {
    const matchupData = await mysql(
      'SELECT m.id as matchupId FROM team t, matchup m WHERE t.id = ? AND t.week = m.week AND (t.id = m.team_a OR t.id = m.team_b)',
      [team_id]
    );

    return res.status(200).json(matchupData);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get League',
    });
  }
};
