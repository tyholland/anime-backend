const mysql = require('../../utils/mysql').instance();

module.exports.getDraft = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    const draft = await mysql(
      'SELECT * FROM draft WHERE league_id = ? AND active = ?',
      [league_id, 1]
    );

    const teams = JSON.parse(draft[0].teams);
    const currentTeam = teams.filter((item) => {
      return item.user_id === userId;
    })[0];

    const specificTeam = await mysql(
      'SELECT id FROM team WHERE league_member_id = ? AND week = ?',
      [currentTeam.id, -1]
    );

    return res
      .status(200)
      .json({ draft: draft[0], userTeamId: specificTeam[0].id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - get the champ',
    });
  }
};
