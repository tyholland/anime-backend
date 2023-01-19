const mysql = require('../../utils/mysql').instance();

module.exports.getMatchup = async (req, res) => {
  const { matchup_id } = req.params;
  const { userId } = req.user;

  try {
    const matchup = await mysql('SELECT * FROM matchup WHERE id = ?', [
      matchup_id,
    ]);

    const user = await mysql(
      'SELECT * from league_members lm, matchup m WHERE m.id = ? AND m.league_id = lm.league_id AND lm.user_id = ?',
      [matchup_id, userId]
    );

    if (!user.length) {
      return res.status(400).json({
        message: 'You are not a user in the league for this matchup.',
      });
    }

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
  const { userId } = req.user;

  try {
    const matchupData = await mysql(
      'SELECT m.id as matchupId FROM team t, matchup m WHERE t.id = ? AND t.week = m.week AND (t.id = m.team_a OR t.id = m.team_b)',
      [team_id]
    );

    const user = await mysql(
      'SELECT * from league_members lm, matchup m WHERE m.id = ? AND m.league_id = lm.league_id AND lm.user_id = ?',
      [matchupData[0].matchupId, userId]
    );

    if (!user.length) {
      return res.status(400).json({
        message: 'You are not a user in the league for this matchup.',
      });
    }

    return res.status(200).json(matchupData);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get League',
    });
  }
};
