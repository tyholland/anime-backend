const mysql = require('../../utils/mysql').instance();
const { getAffinitiesTypes, getBoostPoints } = require('../../utils/index');
const { getLeagueMemebrInfo } = require('../../utils/query');
const {
  formatTeam,
  getTeamQuery,
  getSpecificTeamInfo,
  getUserPoints,
} = require('../../utils/team');
const Profanity = require('profanity-js');
const profanity = new Profanity('', {
  language: 'en-us',
});

module.exports.getTeam = async (req, res) => {
  const { team_id } = req.params;
  const { userId } = req.user;

  try {
    const team = await getTeamQuery(team_id);

    const member = await mysql(
      'SELECT lm.id, lm.team_name, lm.points as userPoints, l.name, lm.league_id FROM league_members lm, league l, team t WHERE lm.user_id = ? AND t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [userId, team_id]
    );

    if (!member.length) {
      return res.status(400).json({
        message: 'There is no member available',
      });
    }

    return await formatTeam(team[0], member[0], userId, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get team',
    });
  }
};

module.exports.getMatchupTeam = async (req, res) => {
  const { team_id } = req.params;
  const { userId } = req.user;

  try {
    const team = await getTeamQuery(team_id);

    const member = await mysql(
      'SELECT lm.id, lm.team_name, lm.points as userPoints, l.name, lm.league_id FROM league_members lm, league l, team t WHERE t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [team_id]
    );

    if (!member.length) {
      return res.status(400).json({
        message: 'There is no member available',
      });
    }

    return await formatTeam(team[0], member[0], userId, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get team',
    });
  }
};

module.exports.getTeamInfo = async (req, res) => {
  const { member_id } = req.params;
  const { userId } = req.user;

  try {
    const { member, rank } = await getSpecificTeamInfo(member_id, userId);

    return res.status(200).json({
      ...member,
      rank,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get team info',
    });
  }
};

module.exports.updateTeamName = async (req, res) => {
  const { name } = req.body;
  const { member_id } = req.params;

  if (!name.length) {
    return res.status(400).json({
      message: 'Please enter a league name',
    });
  }

  if (profanity.isProfane(name)) {
    return res.status(400).json({
      message: 'You can not have profanity in your team name',
    });
  }

  try {
    await mysql('UPDATE league_members SET team_name = ? WHERE id = ?', [
      name,
      member_id,
    ]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
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
      'SELECT t.league_member_id, t.affinity, t.activeAffinity, l.week FROM team t, league l, league_members lm WHERE t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id AND t.week = l.week AND l.is_roster_active = ?',
      [team_id, 1]
    );

    if (!team.length) {
      return res.status(400).json({
        message: 'Editing is disabled for your team.',
      });
    }

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

    const userPoints = await getUserPoints(characterIds, team[0].week);

    if (userPoints < 0) {
      return res.status(400).json({
        message:
          'The Scouter says your power level is OVER 9000! Please readjust your roster',
      });
    }

    let teamPoints = 0;

    const players = characterIds.length
      ? await mysql('SELECT * FROM players WHERE id in (?)', [characterIds])
      : [];

    players.forEach((item) => {
      const affinities = getAffinitiesTypes(item);
      const isBattlefield = item.id === battlefield.id;
      const isBsSupport = item.id === bsSupport.id;
      const isSupport = item.id === support.id;
      const specificSupport =
        item.id === bsBrawler.id ? bsSupport.id : support.id;
      const isSupportInvalid = isSupport || isBsSupport || isBattlefield;
      const votes = [];

      const boost = getBoostPoints(
        isBattlefield,
        isSupportInvalid,
        specificSupport,
        battlefield.id,
        affinities,
        players,
        votes,
        item,
        team[0].affinity,
        team[0].activeAffinity,
        team[0].week
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
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Update team',
    });
  }
};

module.exports.getSchedule = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    const games = await mysql(
      'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b FROM league_members lm, team t, matchup m WHERE lm.user_id = ? AND lm.league_id = ? AND lm.id = t.league_member_id AND (m.team_a = t.id OR m.team_b = t.id)',
      [userId, league_id]
    );

    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const scheduleA = await getLeagueMemebrInfo(teamA);
    const scheduleB = await getLeagueMemebrInfo(teamB);

    const mainSchedule = [];

    for (let index = 0; index < games.length; index++) {
      mainSchedule.push({
        teamA: scheduleA[index].team_name,
        teamB: scheduleB[index].team_name,
        scoreA: games[index].score_a,
        scoreB: games[index].score_b,
        week: index + 1,
        match: games[index].id,
      });
    }

    return res.status(200).json(mainSchedule);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get schedule',
    });
  }
};

module.exports.removeTeam = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    const league = await mysql('SELECT * FROM league WHERE id = ?', [
      league_id,
    ]);

    if (league[0].week >= 0) {
      return res.status(400).json({
        message: 'You can\'t remove your team while the league is active',
      });
    }

    const member = await mysql(
      'SELECT id FROM league_members WHERE user_id = ? AND league_id = ?',
      [userId, league_id]
    );

    await mysql('DELETE FROM team WHERE league_member_id = ?', [member[0].id]);
    await mysql('DELETE FROM league_members WHERE user_id = ?', [userId]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Remove team',
    });
  }
};
