const mysql = require('../../utils/mysql').instance();
const { getAffinitiesTypes, getBoostPoints } = require('../../utils/index');
const { formatTeam, getLeagueMemebrInfo } = require('../../utils/query');

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
  const { userId } = req.user;

  try {
    const member = await mysql(
      'SELECT lm.team_name, lm.points, lm.id, l.name, lm.league_id FROM league_members lm, league l WHERE lm.id = ? AND lm.league_id = l.id',
      [member_id]
    );

    const games = await mysql(
      'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b, t.id as teamId FROM league_members lm, team t, matchup m, league l WHERE lm.user_id = ? AND l.id = ? AND l.id = lm.league_id AND m.week < l.week AND lm.id = t.league_member_id AND (m.team_a = t.id OR m.team_b = t.id)',
      [userId, member[0].league_id]
    );

    let rankings = {
      win: 0,
      loss: 0,
    };

    for (let index = 0; index < games?.length; index++) {
      if (games[index].team_a === games[index].teamId) {
        const isWin = games[index].score_a > games[index].score_b;

        rankings = {
          win: isWin ? rankings.win + 1 : rankings.win,
          loss: !isWin ? rankings.loss + 1 : rankings.loss,
        };
      }

      if (games[index].team_b === games[index].teamId) {
        const isWin = games[index].score_b > games[index].score_a;

        rankings = {
          win: isWin ? rankings.win + 1 : rankings.win,
          loss: !isWin ? rankings.loss + 1 : rankings.loss,
        };
      }
    }

    return res.status(200).json({
      ...member[0],
      rank: rankings,
    });
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

  if (!name.length) {
    return res.status(400).json({
      message: 'Please enter a league name',
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
      });
    }

    return res.status(200).json(mainSchedule);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get schedule',
    });
  }
};
