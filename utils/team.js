const mysql = require('./mysql').instance();
const { characterAttr } = require('./index');

module.exports.createNewTeam = async (userId, leagueId, res) => {
  try {
    const user = await mysql(
      'SELECT u.email, l.week FROM users u, league l WHERE u.id = ? AND l.id = ?',
      [userId, leagueId]
    );

    const defaultTeam = `Team ${user[0].email.split('@')[0]}`;
    const defaultPoints = 9000;

    const members = await mysql(
      'INSERT INTO `league_members` (`user_id`, `league_id`, `team_name`, `points`) VALUES (?, ?, ?, ?)',
      [userId, leagueId, defaultTeam, defaultPoints]
    );

    const team = await mysql(
      'INSERT INTO `team` (`league_member_id`, `week`) VALUES (?, ?)',
      [members.insertId, user[0].week]
    );

    return res.status(200).json({
      teamId: team.insertId,
      leagueId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Can not create a new team',
    });
  }
};

module.exports.getSpecificTeamInfo = async (member_id, userId) => {
  try {
    const member = await mysql(
      'SELECT lm.team_name, lm.points, lm.id, l.name, lm.league_id, l.week as leagueWeek FROM league_members lm, league l WHERE lm.id = ? AND lm.league_id = l.id',
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

    return {
      member: member[0],
      rank: rankings,
    };
  } catch (error) {
    throw new Error('Can not get team info');
  }
};

module.exports.getUserPoints = async (characterIds) => {
  try {
    const players = characterIds.length
      ? await mysql('SELECT * FROM players WHERE id in (?)', [characterIds])
      : [];

    let totalPoints = 0;
    const defaultPoints = 9000;
    players.forEach((item) => {
      totalPoints += item.cost;
    });

    return defaultPoints - totalPoints;
  } catch (err) {
    throw new Error('Can not get user points');
  }
};

const getWeekRecap = async (week, userId, leagueId) => {
  if (week === 1) {
    return;
  }

  try {
    const lastWeek = week - 1;

    const previousMatchup = await mysql(
      'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b, t.id as currentTeamId, lm.team_name FROM league_members lm, team t, matchup m WHERE lm.user_id = ? AND lm.league_id = ? AND lm.recap = ? AND lm.id = t.league_member_id AND m.week = ? AND (m.team_a = t.id OR m.team_b = t.id)',
      [userId, leagueId, 1, lastWeek]
    );

    if (!previousMatchup.length) {
      return null;
    }

    const { currentTeamId, team_a, team_b, score_a, score_b, team_name } =
      previousMatchup[0];

    const opponent = currentTeamId === team_a ? team_b : team_a;
    const winner = score_a > score_b ? team_a : team_b;
    const loser = score_a < score_b ? team_a : team_b;
    let opponentTeam = 'Bye';

    const otherTeam = await mysql(
      'SELECT team_name FROM league_members lm, team t WHERE t.id = ? AND t.league_member_id = lm.id',
      [opponent]
    );

    if (otherTeam.length > 0) {
      opponentTeam = otherTeam[0].team_name;
    }

    return {
      week: week - 1,
      currentTeam: team_name,
      score: `${score_a} to ${score_b}`,
      winner: winner === currentTeamId ? team_name : opponentTeam,
      loser: loser === currentTeamId ? team_name : opponentTeam,
    };
  } catch (err) {
    throw new Error('Can not get week recap');
  }
};

module.exports.formatTeam = async (data, memberInfo, userId, res) => {
  const {
    captain,
    brawler_a,
    brawler_b,
    bs_brawler,
    bs_support,
    support,
    villain,
    battlefield,
    week,
    id,
    status,
    affinity,
    activeAffinity,
  } = data;

  let homeTeam = 'team_a';
  let awayTeam = 'team_b';

  if (status === 'away') {
    homeTeam = 'team_b';
    awayTeam = 'team_a';
  }

  try {
    const matchup = await mysql(
      `SELECT t.villain, t.battlefield, m.id as matchupId FROM matchup m, team t WHERE m.league_id = ? AND m.week = ? AND m.${homeTeam} = ? AND t.id = m.${awayTeam}`,
      [memberInfo.league_id, week, id]
    );
    let characterArr = [
      captain,
      brawler_a,
      brawler_b,
      bs_brawler,
      bs_support,
      support,
      villain,
      battlefield,
    ];

    const userPoints = await this.getUserPoints(characterArr);

    if (matchup.length) {
      characterArr = [
        captain,
        brawler_a,
        brawler_b,
        bs_brawler,
        bs_support,
        support,
        villain,
        battlefield,
        matchup[0].villain,
        matchup[0].battlefield,
      ];
    }

    const characterIds = characterArr.filter((item) => !!item);

    const { member, rank } = await this.getSpecificTeamInfo(
      memberInfo.id,
      userId
    );

    const recap = await getWeekRecap(
      memberInfo.week,
      userId,
      memberInfo.league_id
    );

    if (!characterIds.length) {
      return res.status(200).json({
        teamName: memberInfo.team_name,
        memberId: memberInfo.id,
        userPoints: memberInfo.userPoints,
        team: {
          captain: {
            id: null,
          },
          brawler_a: {
            id: null,
          },
          brawler_b: {
            id: null,
          },
          bs_brawler: {
            id: null,
          },
          bs_support: {
            id: null,
          },
          support: {
            id: null,
          },
          villain: {
            id: null,
          },
          battlefield: {
            id: null,
          },
          week,
          affinity,
          activeAffinity,
        },
        info: {
          ...member,
          rank,
        },
        recap,
      });
    }

    const players = await mysql('SELECT * FROM players WHERE id in (?)', [
      characterIds,
    ]);

    let details = {
      week,
      support,
      bs_support,
      battlefield,
      affinity,
      activeAffinity,
    };

    if (matchup.length) {
      const votes = await mysql(
        'SELECT * FROM votes WHERE matchup_id = ? AND active = ? AND is_bracket = ?',
        [matchup[0].matchupId, 0, 0]
      );

      details = {
        week,
        support,
        bs_support,
        battlefield,
        opponentVillain: matchup[0].villain,
        opponentBattlefield: matchup[0].battlefield,
        votes,
        affinity,
        activeAffinity,
      };
    }

    return res.status(200).json({
      teamName: memberInfo.team_name,
      memberId: memberInfo.id,
      userPoints,
      team: {
        captain: characterAttr(players, captain, 'captain', details),
        brawler_a: characterAttr(players, brawler_a, 'brawler_a', details),
        brawler_b: characterAttr(players, brawler_b, 'brawler_b', details),
        bs_brawler: characterAttr(players, bs_brawler, 'bs_brawler', details),
        bs_support: characterAttr(players, bs_support, 'bs_support', details),
        support: characterAttr(players, support, 'support', details),
        villain: characterAttr(players, villain, 'villain', details),
        battlefield: characterAttr(
          players,
          battlefield,
          'battlefield',
          details
        ),
        week,
        affinity,
        activeAffinity,
      },
      info: {
        ...member,
        rank,
      },
      recap,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Can not format team',
    });
  }
};

module.exports.getFullTeamMatchupPoints = async (teamId, team, matchupId) => {
  try {
    const matchup = await mysql(
      `SELECT t.villain, t.battlefield, m.league_id FROM matchup m, team t WHERE m.id = ? AND m.${team} = t.id`,
      [matchupId]
    );

    const specificTeam = await this.getTeamQuery(teamId);

    const {
      captain,
      brawler_a,
      brawler_b,
      bs_brawler,
      bs_support,
      support,
      villain,
      battlefield,
      week,
      affinity,
      activeAffinity,
    } = specificTeam[0];

    const characterArr = [
      captain,
      brawler_a,
      brawler_b,
      bs_brawler,
      bs_support,
      support,
      villain,
      battlefield,
      matchup[0].villain,
      matchup[0].battlefield,
    ];

    const characterIds = characterArr.filter((item) => !!item);

    const players = await mysql('SELECT * FROM players WHERE id in (?)', [
      characterIds,
    ]);

    const votes = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND active = ? AND is_bracket = ?',
      [matchupId, 0, 0]
    );

    const details = {
      week,
      support,
      bs_support,
      battlefield,
      opponentVillain: matchup[0].villain,
      opponentBattlefield: matchup[0].battlefield,
      votes,
      affinity,
      activeAffinity,
    };

    const captainData = characterAttr(players, captain, 'captain', details);
    const brawlerAData = characterAttr(
      players,
      brawler_a,
      'brawler_a',
      details
    );
    const brawlerBData = characterAttr(
      players,
      brawler_b,
      'brawler_b',
      details
    );
    const bsBrawlerData = characterAttr(
      players,
      bs_brawler,
      'bs_brawler',
      details
    );
    const bsSupportData = characterAttr(
      players,
      bs_support,
      'bs_support',
      details
    );
    const supportData = characterAttr(players, support, 'support', details);
    const villainData = characterAttr(players, villain, 'villain', details);
    const battlefieldData = characterAttr(
      players,
      battlefield,
      'battlefield',
      details
    );

    const captainTotal =
      captainData.matchPoints < 0 ? 0 : captainData.matchPoints;
    const brawlerATotal =
      brawlerAData.matchPoints < 0 ? 0 : brawlerAData.matchPoints;
    const brawlerBTotal =
      brawlerBData.matchPoints < 0 ? 0 : brawlerBData.matchPoints;
    const bsBrawlerTotal =
      bsBrawlerData.matchPoints < 0 ? 0 : bsBrawlerData.matchPoints;
    const bsSupportTotal =
      bsSupportData.matchPoints < 0 ? 0 : bsSupportData.matchPoints;
    const supportTotal =
      supportData.matchPoints < 0 ? 0 : supportData.matchPoints;
    const villainTotal =
      villainData.matchPoints < 0 ? 0 : villainData.matchPoints;
    const battlefieldTotal =
      battlefieldData.matchPoints < 0 ? 0 : battlefieldData.matchPoints;

    const totalTeamPoints =
      captainTotal +
      brawlerATotal +
      brawlerBTotal +
      bsBrawlerTotal +
      bsSupportTotal +
      supportTotal +
      villainTotal +
      battlefieldTotal;

    return totalTeamPoints;
  } catch (err) {
    throw new Error('Can not get full team matchup points');
  }
};

module.exports.getTeamQuery = async (teamId) => {
  return await mysql('SELECT * FROM team WHERE id = ?', [teamId]);
};
