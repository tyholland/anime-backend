const mysql = require('../../utils/mysql').instance();
const { getAffinitiesTypes, getBoostPoints } = require('../../utils/index');
const { formatTeam } = require('../../utils/query');

module.exports.getTeam = async (req, res) => {
  const { team_id } = req.params;
  const { userId } = req.user;

  try {
    const team = await mysql('SELECT * FROM team WHERE id = ?', [team_id]);

    const member = await mysql(
      'SELECT lm.id, lm.team_name, lm.points as userPoints, l.name, lm.league_id FROM league_members lm, league l, team t WHERE lm.user_id = ? AND t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [userId, team_id]
    );

    if (!member.length) {
      return res.status(400).json({
        message: 'There is no member available',
      });
    }

    return await formatTeam(team[0], member[0], res);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get team',
    });
  }
};

module.exports.getMatchupTeam = async (req, res) => {
  const { team_id } = req.params;

  try {
    const team = await mysql('SELECT * FROM team WHERE id = ?', [team_id]);

    const member = await mysql(
      'SELECT lm.id, lm.team_name, lm.points as userPoints, l.name, lm.league_id FROM league_members lm, league l, team t WHERE t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [team_id]
    );

    if (!member.length) {
      return res.status(400).json({
        message: 'There is no member available',
      });
    }

    return await formatTeam(team[0], member[0], res);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get team',
    });
  }
};

module.exports.getTeamInfo = async (req, res) => {
  const { member_id } = req.params;

  try {
    const member = await mysql(
      'SELECT lm.team_name, lm.points, lm.id, l.name FROM league_members lm, league l WHERE lm.id = ? AND lm.league_id = l.id',
      [member_id]
    );

    return res.status(200).json(member);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get team info',
    });
  }
};

module.exports.updateTeamName = async (req, res) => {
  const { name } = req.body;
  const { member_id } = req.params;

  try {
    await mysql('UPDATE league_members SET team_name = ? WHERE id = ?', [
      name,
      member_id,
    ]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Update team name',
    });
  }
};

module.exports.updateTeam = async (req, res) => {
  const { team_id } = req.params;
  const {
    captain,
    brawlerA,
    brawlerB,
    bsBrawler,
    bsSupport,
    support,
    villain,
    battlefield,
  } = req.body;

  try {
    const team = await mysql(
      'SELECT t.league_member_id, l.week FROM team t, league l, league_members lm WHERE t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [team_id]
    );

    const characterArr = [
      captain.id,
      brawlerA.id,
      brawlerB.id,
      bsBrawler.id,
      bsSupport.id,
      support.id,
      villain.id,
      battlefield.id,
    ];
    const characterIds = characterArr.filter((item) => !!item);

    const players = await mysql('SELECT * FROM players WHERE id in (?)', [
      characterIds,
    ]);

    let totalPoints = 0;
    const defaultPoints = 9000;
    players.forEach((item) => {
      totalPoints += item.power_level;
    });
    const userPoints = defaultPoints - totalPoints;

    if (userPoints < 0) {
      return res.status(400).json({
        message:
          'The Scouter says your power level is OVER 9000! Please readjust your roster',
      });
    }

    let teamPoints = 0;

    players.forEach((item) => {
      const affinities = getAffinitiesTypes(item);
      const isBattlefield = item.id === battlefield.id;
      const isBsSupport = item.id === bsSupport.id;
      const isSupport = item.id === support.id;
      const specificSupport =
        item.id === bsBrawler.id ? bsSupport.id : support.id;
      const isSupportInvalid = isSupport || isBsSupport || isBattlefield;

      const boost = getBoostPoints(
        isBattlefield,
        isSupportInvalid,
        specificSupport,
        battlefield.id,
        affinities,
        item.power_level,
        team[0].week,
        players
      );

      teamPoints += item.power_level + boost.total;
    });

    await mysql(
      'UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, points = ? WHERE id = ?',
      [
        captain.id,
        brawlerA.id,
        brawlerB.id,
        bsBrawler.id,
        bsSupport.id,
        support.id,
        villain.id,
        battlefield.id,
        teamPoints,
        team_id,
      ]
    );

    await mysql('UPDATE league_members SET points = ? WHERE id = ?', [
      userPoints,
      team[0].league_member_id,
    ]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Update team',
    });
  }
};
