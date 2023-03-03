const mysql = require('./mysql').instance();
const { characterAttr, sortRankings, randomAffinity } = require('./index');
const { sendLeagueEndedEmail } = require('./mailchimp');

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
      },
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
      'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
      [matchupId, 0]
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
    const rand = Math.floor(Math.random() * (randomAffinity.length + 1));

    try {
      await mysql(
        'INSERT INTO `matchup` (`league_id`, `team_a`, `team_b`, `score_a`, `score_b`, `week`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [leagueId, teamA, teamB, 0, 0, week, 1]
      );

      await mysql(
        'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
        [week, 'home', randomAffinity[rand], teamA]
      );
      await mysql('UPDATE team SET week = ?, status = ? WHERE id = ?', [
        week,
        'away',
        randomAffinity[rand],
        teamB,
      ]);

      return;
    } catch (err) {
      throw new Error(`Can not insert new matchup for week: ${week}`);
    }
  }

  try {
    const weekRand = Math.floor(Math.random() * (randomAffinity.length + 1));

    const newTeamA = await mysql(
      'INSERT INTO `team` (`league_member_id`, `captain`, `brawler_a`, `brawler_b`, `bs_brawler`, `bs_support`, `support`, `villain`, `battlefield`, `week`, `points`, `status`) SELECT league_member_id, captain, brawler_a, brawler_b, bs_brawler, bs_support, support, villain, battlefield, week, points, status FROM team WHERE id = ?',
      [teamA]
    );

    await mysql(
      'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
      [week, 'home', randomAffinity[weekRand], newTeamA.insertId]
    );

    const newTeamB = await mysql(
      'INSERT INTO `team` (`league_member_id`, `captain`, `brawler_a`, `brawler_b`, `bs_brawler`, `bs_support`, `support`, `villain`, `battlefield`, `week`, `points`, `status`) SELECT league_member_id, captain, brawler_a, brawler_b, bs_brawler, bs_support, support, villain, battlefield, week, points, status FROM team WHERE id = ?',
      [teamB]
    );

    await mysql(
      'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
      [week, 'away', randomAffinity[weekRand], newTeamB.insertId]
    );

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
    throw new Error('Can not create six team schedule');
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
    throw new Error('Can not create seven team schedule');
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
    throw new Error('Can not create eight team schedule');
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
    throw new Error('Can not create nine team schedule');
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
    throw new Error('Can not create ten team schedule');
  }
};

module.exports.startNewWeek = async () => {
  try {
    const leagues = await mysql(
      'SELECT id, week, name FROM league WHERE active = ? AND week != ?',
      [1, -1]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { week, id, name } = leagues[index];
      const newWeek = week + 1;

      if (week === 12) {
        await mysql(
          'UPDATE league SET active = ?, is_roster_active = ?, is_voting_active = ? WHERE id = ?',
          [0, 0, 0, id]
        );
        await sendLeagueEndedEmail(name, id);
        return;
      }

      await mysql(
        'UPDATE league SET week = ?, is_roster_active = ? WHERE id = ?',
        [newWeek, 1, id]
      );
    }
  } catch (err) {
    throw new Error('Can not start new week');
  }
};

module.exports.stopRosterStartVoting = async () => {
  try {
    const leagues = await mysql(
      'SELECT id FROM league WHERE active = ? AND (week != ? OR week != ?)',
      [1, 0, -1]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { id } = leagues[index];

      await mysql(
        'UPDATE league SET is_roster_active = ?, is_voting_active = ? WHERE id = ?',
        [0, 1, id]
      );
    }
  } catch (err) {
    throw new Error('Can not stop roster change and start voting');
  }
};

module.exports.stopUserVoting = async () => {
  try {
    const leagues = await mysql(
      'SELECT id FROM league WHERE active = ? AND (week != ? OR week != ?)',
      [1, 0, -1]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { id } = leagues[index];

      await mysql('UPDATE league SET is_voting_active = ? WHERE id = ?', [
        0,
        id,
      ]);
    }
  } catch (err) {
    throw new Error('Can not stop voting');
  }
};

module.exports.getLeagueMemebrInfo = async (arrayOfIds) => {
  return await mysql(
    'SELECT lm.team_name, lm.id FROM league_members lm, team t WHERE t.id IN (?) AND lm.id = t.league_member_id',
    [arrayOfIds]
  );
};

module.exports.checkMatchupUserExists = async (userId, matchupId, res) => {
  const user = await mysql(
    'SELECT * from league_members lm, matchup m WHERE m.id = ? AND m.league_id = lm.league_id AND lm.user_id = ?',
    [matchupId, userId]
  );

  if (!user.length) {
    return res.status(400).json({
      message: 'You are not a user in the league for this matchup.',
    });
  }
};

module.exports.getTeamQuery = async (teamId) => {
  return await mysql('SELECT * FROM team WHERE id = ?', [teamId]);
};

module.exports.checkValidUserInLeague = async (userId, leagueId, res) => {
  const validUser = await mysql(
    'SELECT * FROM league_members WHERE league_id = ? AND user_id = ?',
    [leagueId, userId]
  );

  if (!validUser.length) {
    return res.status(400).json({
      message: 'You are not a user in this league and can not view this page.',
    });
  }
};

module.exports.getRankings = async (games, isFirstWeek = false) => {
  try {
    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const rankingsA = await this.getLeagueMemebrInfo(teamA);
    const rankingsB = await this.getLeagueMemebrInfo(teamB);

    const mainRankings = [];

    if (isFirstWeek) {
      for (let index = 0; index < games.length; index++) {
        mainRankings.find((rank) => {
          if (rank.team === rankingsA[index].team_name) {
            return;
          }
        });

        mainRankings.push({
          team: rankingsA[index].team_name,
          teamId: rankingsA[index].id,
          win: 0,
          loss: 0,
        });

        mainRankings.find((rank) => {
          if (rank.team === rankingsB[index].team_name) {
            return;
          }
        });

        mainRankings.push({
          team: rankingsB[index].team_name,
          teamId: rankingsB[index].id,
          win: 0,
          loss: 0,
        });
      }

      return sortRankings(mainRankings);
    }

    for (let index = 0; index < games.length; index++) {
      mainRankings.find((rank) => {
        if (rank.team === rankingsA[index].team_name) {
          rank.win =
            games[index].score_a > games[index].score_b
              ? rank.win + 1
              : rank.win;
          rank.loss =
            games[index].score_a < games[index].score_b
              ? rank.loss + 1
              : rank.loss;
        }
      });

      mainRankings.push({
        team: rankingsA[index].team_name,
        teamId: rankingsA[index].id,
        win: games[index].score_a > games[index].score_b ? 1 : 0,
        loss: games[index].score_a < games[index].score_b ? 1 : 0,
      });

      mainRankings.find((rank) => {
        if (rank.team === rankingsB[index].team_name) {
          rank.win =
            games[index].score_a > games[index].score_b
              ? rank.win + 1
              : rank.win;
          rank.loss =
            games[index].score_a < games[index].score_b
              ? rank.loss + 1
              : rank.loss;
        }
      });

      mainRankings.push({
        team: rankingsB[index].team_name,
        teamId: rankingsB[index].id,
        win: games[index].score_a > games[index].score_b ? 1 : 0,
        loss: games[index].score_a < games[index].score_b ? 1 : 0,
      });
    }

    return sortRankings(mainRankings);
  } catch (err) {
    throw new Error('Can not get rankings');
  }
};

module.exports.createPlayoffsSchedule = async (leagueId, week) => {
  try {
    const games = await mysql(
      'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b FROM league_members lm, team t, matchup m, league l WHERE l.id = ? AND l.id = lm.league_id AND lm.id = t.league_member_id AND t.week = ? AND (m.team_a = t.id OR m.team_b = t.id)',
      [leagueId, week]
    );

    if (!games.length) {
      return [];
    }

    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const scheduleA = await this.getLeagueMemebrInfo(teamA);
    const scheduleB = await this.getLeagueMemebrInfo(teamB);

    const playoffSchedule = [];

    for (let index = 0; index < games.length; index++) {
      playoffSchedule.push({
        teamA: scheduleA[index].team_name,
        teamB: scheduleB[index].team_name,
        scoreA: games[index].score_a,
        scoreB: games[index].score_b,
        week: index + 1,
      });
    }

    return playoffSchedule;
  } catch (err) {
    throw new Error('Can not create playoffs schedule');
  }
};

module.exports.playoffsFirstRound = async () => {
  try {
    const games = await mysql(
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b, l.id as leagueId FROM league_members lm, team t, matchup m, league l WHERE lm.id = t.league_member_id AND m.team_a = t.id AND l.id = lm.league_id AND l.week = ? AND m.week < l.week',
      [10]
    );

    for (let index = 0; index < games.length; index++) {
      const rankings = await this.getRankings(games[index]);

      await insertNewMatchup(games[index].leagueId, rankings[0], 0, 10);
      await insertNewMatchup(
        games[index].leagueId,
        rankings[2],
        rankings[5],
        10
      );
      await insertNewMatchup(
        games[index].leagueId,
        rankings[3],
        rankings[4],
        10
      );
      await insertNewMatchup(games[index].leagueId, rankings[1], 0, 10);
    }
  } catch (error) {
    throw new Error('Can not get the first round of playoffs');
  }
};

const getPlayoffsRankings = async (games) => {
  try {
    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const rankingsA = await this.getLeagueMemebrInfo(teamA);
    const rankingsB = await this.getLeagueMemebrInfo(teamB);

    const mainRankings = [];

    for (let index = 0; index < games.length; index++) {
      mainRankings.find((rank) => {
        if (rank.team === rankingsA[index].team_name) {
          rank.win =
            games[index].score_a > games[index].score_b
              ? rank.win + 1
              : rank.win;
          rank.loss =
            games[index].score_a < games[index].score_b
              ? rank.loss + 1
              : rank.loss;
        }
      });

      if (games[index].score_a > games[index].score_b) {
        mainRankings.push({
          team: rankingsA[index].team_name,
          teamId: rankingsA[index].id,
        });
      }

      mainRankings.find((rank) => {
        if (rank.team === rankingsB[index].team_name) {
          rank.win =
            games[index].score_a > games[index].score_b
              ? rank.win + 1
              : rank.win;
          rank.loss =
            games[index].score_a < games[index].score_b
              ? rank.loss + 1
              : rank.loss;
        }
      });

      if (games[index].score_a < games[index].score_b) {
        mainRankings.push({
          team: rankingsB[index].team_name,
          teamId: rankingsB[index].id,
        });
      }
    }

    return sortRankings(mainRankings);
  } catch (err) {
    throw new Error('Can not get playoffs rankings');
  }
};

module.exports.playoffsSemis = async () => {
  try {
    const games = await mysql(
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b, l.id as leagueId FROM league_members lm, team t, matchup m, league l WHERE lm.id = t.league_member_id AND m.team_a = t.id AND l.id = lm.league_id AND l.week = ?',
      [10]
    );

    for (let index = 0; index < games.length; index++) {
      const rankings = await getPlayoffsRankings(games[index]);

      await insertNewMatchup(
        games[index].leagueId,
        rankings[0],
        rankings[1],
        11
      );
      await insertNewMatchup(
        games[index].leagueId,
        rankings[2],
        rankings[3],
        11
      );
    }
  } catch (error) {
    throw new Error('Can not get the playoffs semis');
  }
};

module.exports.playoffsFinals = async () => {
  try {
    const games = await mysql(
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b, l.id as leagueId FROM league_members lm, team t, matchup m, league l WHERE lm.id = t.league_member_id AND m.team_a = t.id AND l.id = lm.league_id AND l.week = ?',
      [11]
    );

    for (let index = 0; index < games.length; index++) {
      const rankings = await getPlayoffsRankings(games[index]);

      await insertNewMatchup(
        games[index].leagueId,
        rankings[0],
        rankings[1],
        12
      );
    }
  } catch (error) {
    throw new Error('Can not get the playoffs finals');
  }
};

const insertNewBracketVoting = async (
  player1,
  player2,
  rank,
  bracketId,
  userId
) => {
  const date = new Date().toISOString();

  try {
    await mysql(
      'INSERT INTO `votes` (`initiator_id`, `matchup_id`, `player_a_id`, `player_b_id`, `player_a_count`, `player_b_count`, `rank`, `active`, `is_bracket`, `create_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, bracketId, player1, player2, 0, 0, rank, 1, 1, date]
    );
  } catch (err) {
    throw new Error('Can not create new bracket vote');
  }
};

const getGameWinner = async (voting, match) => {
  try {
    const game = voting.filter((vote) => vote.rank === match)[0];

    await mysql('UPDATE votes SET active = ? WHERE id = ?', [0, game.id]);

    return game.player_a_count < game.player_b_count
      ? game.player_b_id
      : game.player_a_id;
  } catch (err) {
    throw new Error('Can not get game winner and update voting status');
  }
};

module.exports.createBracketFirstRound = async () => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ?',
      [0, 0]
    );

    for (let index = 0; index < bracket.length; index++) {
      await insertNewBracketVoting(
        bracket[index].player_2,
        bracket[index].player_3,
        'game_2',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_4,
        bracket[index].player_5,
        'game_3',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_6,
        bracket[index].player_7,
        'game_4',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_8,
        bracket[index].player_9,
        'game_5',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_10,
        bracket[index].player_11,
        'game_6',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_14,
        bracket[index].player_15,
        'game_9',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_16,
        bracket[index].player_17,
        'game_10',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_18,
        bracket[index].player_19,
        'game_11',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_20,
        bracket[index].player_21,
        'game_12',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_22,
        bracket[index].player_23,
        'game_13',
        bracket[index].id,
        bracket[index].creator_id
      );

      await mysql('UPDATE bracket SET round = ?, active = ? WHERE id = ?', [
        1,
        1,
        bracket[index].id,
      ]);
    }
  } catch (err) {
    throw new Error('Can not create bracket first round');
  }
};

module.exports.createBracketSecondRound = async () => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ?',
      [1, 1]
    );

    for (let index = 0; index < bracket.length; index++) {
      const voting = await mysql(
        'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
        [bracket[index].id, 1]
      );

      const winner2 = getGameWinner(voting, 'game_2');
      const winner3 = getGameWinner(voting, 'game_3');
      const winner4 = getGameWinner(voting, 'game_4');
      const winner6 = getGameWinner(voting, 'game_6');
      const winner9 = getGameWinner(voting, 'game_9');
      const winner10 = getGameWinner(voting, 'game_10');
      const winner11 = getGameWinner(voting, 'game_11');
      const winner13 = getGameWinner(voting, 'game_13');
      getGameWinner(voting, 'game_5');
      getGameWinner(voting, 'game_12');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        bracket[index].player_1,
        winner2,
        'game_15',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner3,
        winner4,
        'game_16',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner6,
        bracket[index].player_12,
        'game_18',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_13,
        winner9,
        'game_19',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner10,
        winner11,
        'game_20',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner13,
        bracket[index].player_24,
        'game_22',
        bracket[index].id,
        bracket[index].creator_id
      );

      // Update Bracket and old Matchups
      await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
        2,
        bracket[index].id,
      ]);
    }
  } catch (err) {
    throw new Error('Can not create bracket second round');
  }
};

module.exports.createBracketThirdRound = async () => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ?',
      [1, 2]
    );

    for (let index = 0; index < bracket.length; index++) {
      const voting = await mysql(
        'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
        [bracket[index].id, 1]
      );

      const winner5 = getGameWinner(voting, 'game_5');
      const winner12 = getGameWinner(voting, 'game_12');
      const winner15 = getGameWinner(voting, 'game_15');
      const winner16 = getGameWinner(voting, 'game_16');
      const winner18 = getGameWinner(voting, 'game_18');
      const winner19 = getGameWinner(voting, 'game_19');
      const winner20 = getGameWinner(voting, 'game_20');
      const winner22 = getGameWinner(voting, 'game_22');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        winner15,
        winner16,
        'game_23',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner5,
        winner18,
        'game_24',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner19,
        winner20,
        'game_25',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner12,
        winner22,
        'game_26',
        bracket[index].id,
        bracket[index].creator_id
      );

      // Update Bracket and old Matchups
      await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
        3,
        bracket[index].id,
      ]);
    }
  } catch (err) {
    throw new Error('Can not create bracket third round');
  }
};

module.exports.createBracketFourthRound = async () => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ?',
      [1, 3]
    );

    for (let index = 0; index < bracket.length; index++) {
      const voting = await mysql(
        'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
        [bracket[index].id, 1]
      );

      const winner23 = getGameWinner(voting, 'game_23');
      const winner24 = getGameWinner(voting, 'game_24');
      const winner25 = getGameWinner(voting, 'game_25');
      const winner26 = getGameWinner(voting, 'game_26');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        winner23,
        winner24,
        'game_27',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner25,
        winner26,
        'game_28',
        bracket[index].id,
        bracket[index].creator_id
      );

      // Update Bracket and old Matchups
      await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
        4,
        bracket[index].id,
      ]);
    }
  } catch (err) {
    throw new Error('Can not create bracket fourth round');
  }
};

module.exports.createBracketFinalRound = async () => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ?',
      [1, 4]
    );

    for (let index = 0; index < bracket.length; index++) {
      const voting = await mysql(
        'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
        [bracket[index].id, 1]
      );

      const winner27 = getGameWinner(voting, 'game_27');
      const winner28 = getGameWinner(voting, 'game_28');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        winner27,
        winner28,
        'game_29',
        bracket[index].id,
        bracket[index].creator_id
      );

      // Update Bracket and old Matchups
      await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
        5,
        bracket[index].id,
      ]);
    }
  } catch (err) {
    throw new Error('Can not create bracket final round');
  }
};

module.exports.createBracketChamp = async () => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ?',
      [1, 5]
    );

    for (let index = 0; index < bracket.length; index++) {
      const voting = await mysql(
        'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
        [bracket[index].id, 1]
      );

      const winner29 = getGameWinner(voting, 'game_20');

      // Update Bracket and old Matchups
      await mysql(
        'UPDATE bracket SET round = ?, active = ?, champ = ? WHERE id = ?',
        [6, 0, winner29, bracket[index].id]
      );
    }
  } catch (err) {
    throw new Error('Can not create bracket champ');
  }
};

module.exports.activateWeeklyAffinity = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, t.week, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND (week != ? OR week != ?) AND l.id = lm.league_id AND lm.id = t.league_member_id AND l.week = t.week',
      [1, 0, -1]
    );

    if (!teams.length) {
      return;
    }

    for (let index = 0; index < teams.length; index++) {
      const { id, league_id, week } = teams[index];

      // Update activeAffinity to be true
      await mysql('UPDATE team SET activeAffinity = ? WHERE id = ?', [1, id]);

      // Update matchup scores
      const matchup = await mysql(
        'SELECT * FROM matchup WHERE league_id = ? AND week = ?',
        [league_id, week]
      );

      for (let index = 0; index < matchup.length; index++) {
        const { id, team_a, team_b } = matchup[index];

        const scoreA = await this.getFullTeamMatchupPoints(
          team_a,
          'team_b',
          id
        );
        const scoreB = await this.getFullTeamMatchupPoints(
          team_b,
          'team_a',
          id
        );

        await mysql(
          'UPDATE matchup SET score_a = ?, score_b = ? WHERE id = ?',
          [scoreA, scoreB, id]
        );
      }
    }
  } catch (err) {
    throw new Error('Can not activate weekly affinity');
  }
};
