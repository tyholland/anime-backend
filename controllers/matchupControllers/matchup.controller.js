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
