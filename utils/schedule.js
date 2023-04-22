const mysql = require('./mysql').instance();
const { sortRankings, randomAffinity } = require('./index');
const { getLeagueMemebrInfo, getRankings } = require('./query');

const insertNewMatchup = async (leagueId, teamA, teamB, week) => {
  if (week === 1) {
    const rand = Math.floor(Math.random() * randomAffinity.length);

    try {
      await mysql(
        'INSERT INTO `matchup` (`league_id`, `team_a`, `team_b`, `score_a`, `score_b`, `week`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [leagueId, teamA, teamB, 0, 0, week, 1]
      );

      await mysql(
        'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
        [0, 'home', randomAffinity[rand], teamA]
      );

      await mysql(
        'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
        [0, 'away', randomAffinity[rand], teamB]
      );

      return;
    } catch (err) {
      throw new Error(`Can not insert new matchup for week: ${week}`);
    }
  }

  try {
    const weekRand = Math.floor(Math.random() * randomAffinity.length);

    const newTeamA = await mysql(
      'INSERT INTO `team` (`league_member_id`, `captain`, `brawler_a`, `brawler_b`, `bs_brawler`, `bs_support`, `support`, `villain`, `battlefield`, `week`, `points`, `status`) SELECT league_member_id, captain, brawler_a, brawler_b, bs_brawler, bs_support, support, villain, battlefield, week, points, status FROM team WHERE league_member_id = ?',
      [teamA]
    );

    await mysql(
      'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
      [week, 'home', randomAffinity[weekRand], newTeamA.insertId]
    );

    const newTeamB = await mysql(
      'INSERT INTO `team` (`league_member_id`, `captain`, `brawler_a`, `brawler_b`, `bs_brawler`, `bs_support`, `support`, `villain`, `battlefield`, `week`, `points`, `status`) SELECT league_member_id, captain, brawler_a, brawler_b, bs_brawler, bs_support, support, villain, battlefield, week, points, status FROM team WHERE league_member_id = ?',
      [teamB]
    );

    await mysql(
      'UPDATE team SET week = ?, status = ?, affinity = ? WHERE id = ?',
      [week, 'away', randomAffinity[weekRand], newTeamB.insertId]
    );

    const teamIdB = newTeamB.insertId || 0;
    const teamScoreByeA = !newTeamB.insertId ? 1 : 0;
    const activeWeek = (week === 10 || week > 10) ? 1 : 0;

    await mysql(
      'INSERT INTO `matchup` (`league_id`, `team_a`, `team_b`, `score_a`, `score_b`, `week`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [leagueId, newTeamA.insertId, teamIdB, teamScoreByeA, 0, week, activeWeek]
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
  } catch (err) {
    throw new Error('Can not create ten team schedule');
  }
};

module.exports.createPlayoffsSchedule = async (leagueId, week, round) => {
  try {
    const games = await mysql(
      'SELECT id, team_a, team_b, score_a, score_b FROM matchup WHERE league_id = ? AND week = ?',
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

    const scheduleA = await getLeagueMemebrInfo(teamA);
    let scheduleB = await getLeagueMemebrInfo(teamB);

    const playoffSchedule = [];

    if (round === 'first') {
      const byeTeams = [
        {
          team_name: 'Bye',
          id: 'Bye - 0'
        },
        {
          team_name: 'Bye',
          id: 'Bye - 1'
        }
      ];

      scheduleB = byeTeams.concat(scheduleB);
    }

    for (let index = 0; index < games.length; index++) {
      playoffSchedule.push({
        teamA: scheduleA[index].team_name,
        teamB: games[index].team_b === 0 ? 'Bye' : scheduleB[index].team_name,
        scoreA: games[index].score_a < 0 ? 0 : games[index].score_a,
        scoreB: games[index].score_b < 0 ? 0 : games[index].score_b,
        week: index + 1,
        match: games[index].id
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

    const rankings = await getRankings(games);
    const leagueId = games[0].leagueId;

    await insertNewMatchup(leagueId, rankings[0].teamId, 0, 10);
    await insertNewMatchup(leagueId, rankings[1].teamId, 0, 10);
    await insertNewMatchup(
      leagueId,
      rankings[2].teamId,
      rankings[5].teamId,
      10
    );
    await insertNewMatchup(
      leagueId,
      rankings[3].teamId,
      rankings[4].teamId,
      10
    );
  } catch (error) {
    throw new Error('Can not get the first round of playoffs');
  }
};

const getPlayoffsRankings = async (games, week = null) => {
  try {
    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const rankingsA = await getLeagueMemebrInfo(teamA);
    let rankingsB = await getLeagueMemebrInfo(teamB);

    const mainRankings = [];
    
    if (week === 11) {
      const byeTeams = [
        {
          team_name: 'Bye Team Name - 0',
          id: 'Bye Team Id - 0'
        },
        {
          team_name: 'Bye Team Name - 1',
          id: 'Bye Team Id - 1'
        }
      ];

      rankingsB = byeTeams.concat(rankingsB);
    }

    for (let index = 0; index < games.length; index++) {
      const hasRankingA = mainRankings.some(
        (rank) => rank.team === rankingsA[index].team_name
      );
      const hasRankingB = mainRankings.some(
        (rank) => rank.team === rankingsB[index].team_name
      );

      if (hasRankingA) {
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
      }

      if (!hasRankingA) {
        mainRankings.push({
          team: rankingsA[index].team_name,
          teamId: rankingsA[index].id,
          win: games[index].score_a > games[index].score_b ? 1 : 0,
          loss: games[index].score_a < games[index].score_b ? 1 : 0,
        });
      }

      if (hasRankingB) {
        mainRankings.find((rank) => {
          if (rank.team === rankingsB[index].team_name) {
            rank.win =
              games[index].score_b > games[index].score_a
                ? rank.win + 1
                : rank.win;
            rank.loss =
              games[index].score_b < games[index].score_a
                ? rank.loss + 1
                : rank.loss;
          }
        });
      }

      if (!hasRankingB) {
        mainRankings.push({
          team: games[index].team_b === 0 ? `Bye Team Name - ${index}` : rankingsB[index].team_name,
          teamId: games[index].team_b === 0 ? `Bye Team Id - ${index}` : rankingsB[index].id,
          win: games[index].score_b > games[index].score_a ? 1 : 0,
          loss: games[index].score_b < games[index].score_a ? 1 : 0,
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
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b, l.id as leagueId FROM league_members lm, team t, matchup m, league l WHERE m.week = ? AND m.team_a = t.id AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [10]
    );

    const rankings = await getPlayoffsRankings(games, 11);
    const leagueId = games[0].leagueId;

    await insertNewMatchup(
      leagueId,
      rankings[0].teamId,
      rankings[3].teamId,
      11
    );
    await insertNewMatchup(
      leagueId,
      rankings[1].teamId,
      rankings[2].teamId,
      11
    );
  } catch (error) {
    throw new Error('Can not get the playoffs semis');
  }
};

module.exports.playoffsFinals = async () => {
  try {
    const games = await mysql(
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b, l.id as leagueId FROM league_members lm, team t, matchup m, league l WHERE m.week = ? AND m.team_a = t.id AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [11]
    );

    const rankings = await getPlayoffsRankings(games);
    const leagueId = games[0].leagueId;

    await insertNewMatchup(
      leagueId,
      rankings[0].teamId,
      rankings[1].teamId,
      12
    );
  } catch (error) {
    throw new Error('Can not get the playoffs finals');
  }
};
