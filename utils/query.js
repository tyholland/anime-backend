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
    return res.status(500).json({
      ...error,
      action: 'Can not create a new team',
    });
  }
};

module.exports.formatTeam = async (data, member, res) => {
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
    points,
    id,
    status,
  } = data;

  let homeTeam = 'team_a';
  let awayTeam = 'team_b';

  if (status === 'away') {
    homeTeam = 'team_b';
    awayTeam = 'team_a';
  }

  try {
    const matchup = await mysql(
      `SELECT t.villain, t.battlefield FROM matchup m, team t WHERE m.league_id = ? AND m.week = ? AND m.${homeTeam} = ? AND t.id = m.${awayTeam}`,
      [member.league_id, week, id]
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

    if (!characterIds.length) {
      return res.status(200).json({
        teamName: member.team_name,
        memberId: member.id,
        userPoints: member.userPoints,
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
          points,
        },
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
    };

    if (matchup.length) {
      details = {
        week,
        support,
        bs_support,
        battlefield,
        opponentVillain: matchup[0].villain,
        opponentBattlefield: matchup[0].battlefield,
      };
    }

    return res.status(200).json({
      teamName: member.team_name,
      memberId: member.id,
      userPoints: member.userPoints,
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
        points,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Can not format team',
    });
  }
};

module.exports.getFullTeamMatchupPoints = async (teamId, team, matchupId) => {
  try {
    const matchup = await mysql(
      `SELECT t.villain, t.battlefield FROM matchup m, team t WHERE m.id = ? AND m.${team} = t.id`,
      [matchupId]
    );

    const specificTeam = await mysql('SELECT * FROM team WHERE id = ?', [
      teamId,
    ]);

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

    const details = {
      week,
      support,
      bs_support,
      battlefield,
      opponentVillain: matchup[0].villain,
      opponentBattlefield: matchup[0].battlefield,
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

    const totalTeamPoints =
      captainData.matchPoints +
      brawlerAData.matchPoints +
      brawlerBData.matchPoints +
      bsBrawlerData.matchPoints +
      bsSupportData.matchPoints +
      supportData.matchPoints +
      villainData.matchPoints +
      battlefieldData.matchPoints;

    return totalTeamPoints;
  } catch (err) {
    throw new Error('Can not get full team matchup points');
  }
};

const insertNewMatchup = async (leagueId, teamA, teamB, week) => {
  if (week === 1) {
    try {
      await mysql(
        'INSERT INTO `matchup` (`league_id`, `team_a`, `team_b`, `score_a`, `score_b`, `week`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [leagueId, teamA, teamB, 0, 0, week, 1]
      );

      await mysql('UPDATE team SET week = ?, status = ? WHERE id = ?', [
        week,
        'home',
        teamA,
      ]);
      await mysql('UPDATE team SET week = ?, status = ? WHERE id = ?', [
        week,
        'away',
        teamB,
      ]);

      return;
    } catch (err) {
      throw new Error(`Can not insert new matchup for week: ${week}`);
    }
  }

  try {
    const newTeamA = await mysql(
      'INSERT INTO `team` (`league_member_id`, `captain`, `brawler_a`, `brawler_b`, `bs_brawler`, `bs_support`, `support`, `villain`, `battlefield`, `week`, `points`, `status`) SELECT league_member_id, captain, brawler_a, brawler_b, bs_brawler, bs_support, support, villain, battlefield, week, points, status FROM team WHERE id = ?',
      [teamA]
    );

    await mysql('UPDATE team SET week = ?, status = ? WHERE id = ?', [
      week,
      'home',
      newTeamA.insertId,
    ]);

    const newTeamB = await mysql(
      'INSERT INTO `team` (`league_member_id`, `captain`, `brawler_a`, `brawler_b`, `bs_brawler`, `bs_support`, `support`, `villain`, `battlefield`, `week`, `points`, `status`) SELECT league_member_id, captain, brawler_a, brawler_b, bs_brawler, bs_support, support, villain, battlefield, week, points, status FROM team WHERE id = ?',
      [teamB]
    );

    await mysql('UPDATE team SET week = ?, status = ? WHERE id = ?', [
      week,
      'away',
      newTeamB.insertId,
    ]);

    await mysql(
      'INSERT INTO `matchup` (`league_id`, `team_a`, `team_b`, `score_a`, `score_b`, `week`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [leagueId, newTeamA.insertId, newTeamB.insertId, 0, 0, week, 0]
    );

    return;
  } catch (err) {
    throw new Error(`Can not insert new matchup for week: ${week}`);
  }
};

module.exports.createSixTeamSchedule = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND l.week = ? AND l.num_teams = ? AND l.id = lm.league_id AND lm.id = t.league_member_id',
      [1, 0, 6]
    );

    if (!teams.length) {
      return;
    }

    const team1 = teams[0].id;
    const team2 = teams[1].id;
    const team3 = teams[2].id;
    const team4 = teams[3].id;
    const team5 = teams[4].id;
    const team6 = teams[5].id;
    const leagueId = teams[0].league_id;

    // Week 1
    await insertNewMatchup(leagueId, team1, team2, 1);
    await insertNewMatchup(leagueId, team3, team4, 1);
    await insertNewMatchup(leagueId, team5, team6, 1);

    // Week 2
    await insertNewMatchup(leagueId, team5, team4, 2);
    await insertNewMatchup(leagueId, team1, team6, 2);
    await insertNewMatchup(leagueId, team2, team3, 2);

    // Week 3
    await insertNewMatchup(leagueId, team3, team1, 3);
    await insertNewMatchup(leagueId, team2, team5, 3);
    await insertNewMatchup(leagueId, team6, team4, 3);

    // Week 4
    await insertNewMatchup(leagueId, team2, team6, 4);
    await insertNewMatchup(leagueId, team4, team1, 4);
    await insertNewMatchup(leagueId, team3, team5, 4);

    // Week 5
    await insertNewMatchup(leagueId, team1, team5, 5);
    await insertNewMatchup(leagueId, team6, team3, 5);
    await insertNewMatchup(leagueId, team4, team2, 5);

    // Week 6
    await insertNewMatchup(leagueId, team3, team2, 6);
    await insertNewMatchup(leagueId, team4, team5, 6);
    await insertNewMatchup(leagueId, team1, team6, 6);

    // Week 7
    await insertNewMatchup(leagueId, team5, team6, 7);
    await insertNewMatchup(leagueId, team1, team2, 7);
    await insertNewMatchup(leagueId, team3, team4, 7);

    // Week 8
    await insertNewMatchup(leagueId, team1, team4, 8);
    await insertNewMatchup(leagueId, team5, team3, 8);
    await insertNewMatchup(leagueId, team6, team2, 8);

    // Week 9
    await insertNewMatchup(leagueId, team6, team3, 9);
    await insertNewMatchup(leagueId, team2, team4, 9);
    await insertNewMatchup(leagueId, team5, team1, 9);

    await mysql('UPDATE league SET week = ? WHERE id = ?', [1, leagueId]);
  } catch (err) {
    throw new Error('Can not create six team scedule');
  }
};

module.exports.createSevenTeamSchedule = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND l.week = ? AND l.num_teams = ? AND l.id = lm.league_id AND lm.id = t.league_member_id',
      [1, 0, 7]
    );

    if (!teams.length) {
      return;
    }

    const team1 = teams[0].id;
    const team2 = teams[1].id;
    const team3 = teams[2].id;
    const team4 = teams[3].id;
    const team5 = teams[4].id;
    const team6 = teams[5].id;
    const team7 = teams[6].id;
    const leagueId = teams[0].league_id;

    // Week 1
    await insertNewMatchup(leagueId, team2, team1, 1);
    await insertNewMatchup(leagueId, team3, 0, 1);
    await insertNewMatchup(leagueId, team4, team7, 1);
    await insertNewMatchup(leagueId, team5, team6, 1);

    // Week 2
    await insertNewMatchup(leagueId, team3, team4, 2);
    await insertNewMatchup(leagueId, team1, team7, 2);
    await insertNewMatchup(leagueId, 0, team6, 2);
    await insertNewMatchup(leagueId, team2, team5, 2);

    // Week 3
    await insertNewMatchup(leagueId, team6, team2, 3);
    await insertNewMatchup(leagueId, team7, 0, 3);
    await insertNewMatchup(leagueId, team4, team1, 3);
    await insertNewMatchup(leagueId, team5, team3, 3);

    // Week 4
    await insertNewMatchup(leagueId, team7, team5, 4);
    await insertNewMatchup(leagueId, 0, team4, 4);
    await insertNewMatchup(leagueId, team2, team3, 4);
    await insertNewMatchup(leagueId, team6, team1, 4);

    // Week 5
    await insertNewMatchup(leagueId, team1, team3, 5);
    await insertNewMatchup(leagueId, team4, team2, 5);
    await insertNewMatchup(leagueId, team5, 0, 5);
    await insertNewMatchup(leagueId, team6, team7, 5);

    // Week 6
    await insertNewMatchup(leagueId, team4, team5, 6);
    await insertNewMatchup(leagueId, 0, team1, 6);
    await insertNewMatchup(leagueId, team2, team7, 6);
    await insertNewMatchup(leagueId, team3, team6, 6);

    // Week 7
    await insertNewMatchup(leagueId, team7, team3, 7);
    await insertNewMatchup(leagueId, 0, team2, 7);
    await insertNewMatchup(leagueId, team1, team5, 7);
    await insertNewMatchup(leagueId, team6, team4, 7);

    // Week 8
    await insertNewMatchup(leagueId, team2, team1, 8);
    await insertNewMatchup(leagueId, team3, 0, 8);
    await insertNewMatchup(leagueId, team4, team7, 8);
    await insertNewMatchup(leagueId, team5, team6, 8);

    // Week 9
    await insertNewMatchup(leagueId, team3, team4, 9);
    await insertNewMatchup(leagueId, team1, team7, 9);
    await insertNewMatchup(leagueId, 0, team6, 9);
    await insertNewMatchup(leagueId, team2, team5, 9);

    await mysql('UPDATE league SET week = ? WHERE id = ?', [1, leagueId]);
  } catch (err) {
    throw new Error('Can not create seven team scedule');
  }
};

module.exports.createEightTeamSchedule = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND l.week = ? AND l.num_teams = ? AND l.id = lm.league_id AND lm.id = t.league_member_id',
      [1, 0, 8]
    );

    if (!teams.length) {
      return;
    }

    const team1 = teams[0].id;
    const team2 = teams[1].id;
    const team3 = teams[2].id;
    const team4 = teams[3].id;
    const team5 = teams[4].id;
    const team6 = teams[5].id;
    const team7 = teams[6].id;
    const team8 = teams[7].id;
    const leagueId = teams[0].league_id;

    // Week 1
    await insertNewMatchup(leagueId, team1, team2, 1);
    await insertNewMatchup(leagueId, team3, team4, 1);
    await insertNewMatchup(leagueId, team5, team6, 1);
    await insertNewMatchup(leagueId, team7, team8, 1);

    // Week 2
    await insertNewMatchup(leagueId, team6, team8, 2);
    await insertNewMatchup(leagueId, team5, team7, 2);
    await insertNewMatchup(leagueId, team2, team4, 2);
    await insertNewMatchup(leagueId, team1, team3, 2);

    // Week 3
    await insertNewMatchup(leagueId, team5, team4, 3);
    await insertNewMatchup(leagueId, team1, team8, 3);
    await insertNewMatchup(leagueId, team7, team3, 3);
    await insertNewMatchup(leagueId, team2, team6, 3);

    // Week 4
    await insertNewMatchup(leagueId, team3, team6, 4);
    await insertNewMatchup(leagueId, team7, team2, 4);
    await insertNewMatchup(leagueId, team1, team5, 4);
    await insertNewMatchup(leagueId, team8, team4, 4);

    // Week 5
    await insertNewMatchup(leagueId, team7, team1, 5);
    await insertNewMatchup(leagueId, team4, team6, 5);
    await insertNewMatchup(leagueId, team3, team8, 5);
    await insertNewMatchup(leagueId, team5, team2, 5);

    // Week 6
    await insertNewMatchup(leagueId, team2, team3, 6);
    await insertNewMatchup(leagueId, team8, team5, 6);
    await insertNewMatchup(leagueId, team4, team1, 6);
    await insertNewMatchup(leagueId, team6, team7, 6);

    // Week 7
    await insertNewMatchup(leagueId, team4, team7, 7);
    await insertNewMatchup(leagueId, team6, team1, 7);
    await insertNewMatchup(leagueId, team8, team2, 7);
    await insertNewMatchup(leagueId, team3, team5, 7);

    // Week 8
    await insertNewMatchup(leagueId, team5, team6, 8);
    await insertNewMatchup(leagueId, team7, team8, 8);
    await insertNewMatchup(leagueId, team3, team4, 8);
    await insertNewMatchup(leagueId, team1, team2, 8);

    // Week 9
    await insertNewMatchup(leagueId, team2, team4, 9);
    await insertNewMatchup(leagueId, team1, team3, 9);
    await insertNewMatchup(leagueId, team5, team7, 9);
    await insertNewMatchup(leagueId, team6, team8, 9);

    await mysql('UPDATE league SET week = ? WHERE id = ?', [1, leagueId]);
  } catch (err) {
    throw new Error('Can not create eight team scedule');
  }
};

module.exports.createNineTeamSchedule = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND l.week = ? AND l.num_teams = ? AND l.id = lm.league_id AND lm.id = t.league_member_id',
      [1, 0, 9]
    );

    if (!teams.length) {
      return;
    }

    const team1 = teams[0].id;
    const team2 = teams[1].id;
    const team3 = teams[2].id;
    const team4 = teams[3].id;
    const team5 = teams[4].id;
    const team6 = teams[5].id;
    const team7 = teams[6].id;
    const team8 = teams[7].id;
    const team9 = teams[8].id;
    const leagueId = teams[0].league_id;

    // Week 1
    await insertNewMatchup(leagueId, team1, 0, 1);
    await insertNewMatchup(leagueId, team2, team9, 1);
    await insertNewMatchup(leagueId, team3, team8, 1);
    await insertNewMatchup(leagueId, team4, team7, 1);
    await insertNewMatchup(leagueId, team5, team6, 1);

    // Week 2
    await insertNewMatchup(leagueId, team7, team2, 2);
    await insertNewMatchup(leagueId, team6, team3, 2);
    await insertNewMatchup(leagueId, team5, team4, 2);
    await insertNewMatchup(leagueId, 0, team9, 2);
    await insertNewMatchup(leagueId, team8, team1, 2);

    // Week 3
    await insertNewMatchup(leagueId, team9, team8, 3);
    await insertNewMatchup(leagueId, team1, team7, 3);
    await insertNewMatchup(leagueId, team6, team2, 3);
    await insertNewMatchup(leagueId, team5, team3, 3);
    await insertNewMatchup(leagueId, team4, 0, 3);

    // Week 4
    await insertNewMatchup(leagueId, team4, team3, 4);
    await insertNewMatchup(leagueId, 0, team8, 4);
    await insertNewMatchup(leagueId, team9, team7, 4);
    await insertNewMatchup(leagueId, team6, team1, 4);
    await insertNewMatchup(leagueId, team2, team5, 4);

    // Week 5
    await insertNewMatchup(leagueId, 0, team6, 5);
    await insertNewMatchup(leagueId, team7, team5, 5);
    await insertNewMatchup(leagueId, team2, team1, 5);
    await insertNewMatchup(leagueId, team8, team4, 5);
    await insertNewMatchup(leagueId, team9, team3, 5);

    // Week 6
    await insertNewMatchup(leagueId, team5, team9, 6);
    await insertNewMatchup(leagueId, team8, team6, 6);
    await insertNewMatchup(leagueId, team7, 0, 6);
    await insertNewMatchup(leagueId, team3, team2, 6);
    await insertNewMatchup(leagueId, team1, team4, 6);

    // Week 7
    await insertNewMatchup(leagueId, team3, team1, 7);
    await insertNewMatchup(leagueId, team9, team4, 7);
    await insertNewMatchup(leagueId, team8, team5, 7);
    await insertNewMatchup(leagueId, team7, team6, 7);
    await insertNewMatchup(leagueId, 0, team2, 7);

    // Week 8
    await insertNewMatchup(leagueId, team6, team4, 8);
    await insertNewMatchup(leagueId, team5, 0, 8);
    await insertNewMatchup(leagueId, team1, team9, 8);
    await insertNewMatchup(leagueId, team2, team8, 8);
    await insertNewMatchup(leagueId, team3, team7, 8);

    // Week 9
    await insertNewMatchup(leagueId, team8, team7, 9);
    await insertNewMatchup(leagueId, team4, team2, 9);
    await insertNewMatchup(leagueId, 0, team3, 9);
    await insertNewMatchup(leagueId, team1, team5, 9);
    await insertNewMatchup(leagueId, team6, team9, 9);

    await mysql('UPDATE league SET week = ? WHERE id = ?', [1, leagueId]);
  } catch (err) {
    throw new Error('Can not create nine team scedule');
  }
};

module.exports.createTenTeamSchedule = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND l.week = ? AND l.num_teams = ? AND l.id = lm.league_id AND lm.id = t.league_member_id',
      [1, 0, 10]
    );

    if (!teams.length) {
      return;
    }

    const team1 = teams[0].id;
    const team2 = teams[1].id;
    const team3 = teams[2].id;
    const team4 = teams[3].id;
    const team5 = teams[4].id;
    const team6 = teams[5].id;
    const team7 = teams[6].id;
    const team8 = teams[7].id;
    const team9 = teams[8].id;
    const team10 = teams[9].id;
    const leagueId = teams[0].league_id;

    // Week 1
    await insertNewMatchup(leagueId, team1, team10, 1);
    await insertNewMatchup(leagueId, team2, team9, 1);
    await insertNewMatchup(leagueId, team3, team8, 1);
    await insertNewMatchup(leagueId, team4, team7, 1);
    await insertNewMatchup(leagueId, team5, team6, 1);

    // Week 2
    await insertNewMatchup(leagueId, team7, team2, 2);
    await insertNewMatchup(leagueId, team6, team3, 2);
    await insertNewMatchup(leagueId, team5, team4, 2);
    await insertNewMatchup(leagueId, team10, team9, 2);
    await insertNewMatchup(leagueId, team8, team1, 2);

    // Week 3
    await insertNewMatchup(leagueId, team9, team8, 3);
    await insertNewMatchup(leagueId, team1, team7, 3);
    await insertNewMatchup(leagueId, team6, team2, 3);
    await insertNewMatchup(leagueId, team5, team3, 3);
    await insertNewMatchup(leagueId, team4, team10, 3);

    // Week 4
    await insertNewMatchup(leagueId, team4, team3, 4);
    await insertNewMatchup(leagueId, team10, team8, 4);
    await insertNewMatchup(leagueId, team9, team7, 4);
    await insertNewMatchup(leagueId, team6, team1, 4);
    await insertNewMatchup(leagueId, team2, team5, 4);

    // Week 5
    await insertNewMatchup(leagueId, team10, team6, 5);
    await insertNewMatchup(leagueId, team7, team5, 5);
    await insertNewMatchup(leagueId, team2, team1, 5);
    await insertNewMatchup(leagueId, team8, team4, 5);
    await insertNewMatchup(leagueId, team9, team3, 5);

    // Week 6
    await insertNewMatchup(leagueId, team5, team9, 6);
    await insertNewMatchup(leagueId, team8, team6, 6);
    await insertNewMatchup(leagueId, team7, team10, 6);
    await insertNewMatchup(leagueId, team3, team2, 6);
    await insertNewMatchup(leagueId, team1, team4, 6);

    // Week 7
    await insertNewMatchup(leagueId, team3, team1, 7);
    await insertNewMatchup(leagueId, team9, team4, 7);
    await insertNewMatchup(leagueId, team8, team5, 7);
    await insertNewMatchup(leagueId, team7, team6, 7);
    await insertNewMatchup(leagueId, team10, team2, 7);

    // Week 8
    await insertNewMatchup(leagueId, team6, team4, 8);
    await insertNewMatchup(leagueId, team5, team10, 8);
    await insertNewMatchup(leagueId, team1, team9, 8);
    await insertNewMatchup(leagueId, team2, team8, 8);
    await insertNewMatchup(leagueId, team3, team7, 8);

    // Week 9
    await insertNewMatchup(leagueId, team8, team7, 9);
    await insertNewMatchup(leagueId, team4, team2, 9);
    await insertNewMatchup(leagueId, team10, team3, 9);
    await insertNewMatchup(leagueId, team1, team5, 9);
    await insertNewMatchup(leagueId, team6, team9, 9);

    await mysql('UPDATE league SET week = ? WHERE id = ?', [1, leagueId]);
  } catch (err) {
    throw new Error('Can not create ten team scedule');
  }
};
