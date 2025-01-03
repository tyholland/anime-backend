const {
  shuffleArray,
  getAffinitiesTypes,
  getBoostPoints,
} = require('../../utils');
const { sendLeagueDraftSchedule } = require('../../utils/mailchimp');
const { checkValidUserInLeague } = require('../../utils/query');
const { getUserPoints } = require('../../utils/team');
const mysql = require('../../utils/mysql').instance();

module.exports.getDraft = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    await checkValidUserInLeague(userId, league_id, res);

    const league = await mysql(
      'SELECT * FROM league WHERE id = ? AND draft_active = ?',
      [league_id, 1]
    );

    if (!league.length) {
      const admin = await mysql(
        'SELECT l.creator_id, l.draft_complete, d.teams, l.name, l.draft_schedule FROM league l, draft d WHERE l.id = ? AND l.id = d.league_id',
        [league_id]
      );

      return res.status(400).json({
        message: 'This draft is not active at the moment',
        creator: admin[0].creator_id,
        leagueName: admin[0].name,
        draftComplete: admin[0].draft_complete === 1,
        draft: admin,
        draftSchedule: admin[0].draft_schedule,
      });
    }

    const draft = await mysql(
      'SELECT * FROM draft WHERE league_id = ? AND active = ?',
      [league_id, 1]
    );

    if (!draft.length) {
      return res.status(400).json({
        message: 'There are no active rounds in this draft',
      });
    }

    if (!draft[0].recent_pick) {
      const oldDraft = await mysql(
        'SELECT * FROM draft WHERE league_id = ? AND round = ?',
        [league_id, draft[0].round - 1]
      );

      if (oldDraft.length) {
        draft[0].recent_pick = oldDraft[0].recent_pick;
      }
    }

    const teams = JSON.parse(draft[0].teams);
    const currentTeam = teams.filter((item) => {
      return item.user_id === userId;
    })[0];

    const specificTeam = await mysql(
      'SELECT id FROM team WHERE league_member_id = ? AND week = ?',
      [currentTeam.id, -1]
    );

    const defaultTime = 60;
    const startTime = new Date(`${draft[0].start_time}`);
    const currentTime = new Date();
    const totalSeconds =
      Math.abs(currentTime.getTime() - startTime.getTime()) / 1000;

    const member = await mysql(
      'SELECT * FROM league_members WHERE user_id = ? AND league_id = ?',
      [userId, league_id]
    );

    if (member[0].draft_reset_timer === 1) {
      await mysql(
        'UPDATE league_members SET draft_reset_timer = ? WHERE user_id = ? AND league_id = ?',
        [0, userId, league_id]
      );
    }

    return res.status(200).json({
      draft: draft[0],
      userTeamId: specificTeam[0].id,
      remainingTime: Math.floor(defaultTime - totalSeconds),
      draftComplete: league[0].draft_complete === 1,
      resetTimer: member[0].draft_reset_timer === 1,
      draftSchedule: league[0].draft_schedule,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get Draft',
    });
  }
};

module.exports.createDraft = async (req, res) => {
  const { league_id } = req.params;
  const date = new Date().toISOString();

  try {
    const teams = await mysql(
      'SELECT id, user_id, team_name FROM league_members WHERE league_id = ?',
      [league_id]
    );
    const shuffledTeams = shuffleArray(teams);
    const destructiveArr = [...shuffledTeams];
    const reverseShuffle = destructiveArr.reverse();

    // Round 1
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [1, league_id, JSON.stringify(shuffledTeams), 0, 0, date]
    );

    // Round 2
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [2, league_id, JSON.stringify(reverseShuffle), 0, 0, date]
    );

    // Round 3
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [3, league_id, JSON.stringify(shuffledTeams), 0, 0, date]
    );

    // Round 4
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [4, league_id, JSON.stringify(reverseShuffle), 0, 0, date]
    );

    // Round 5
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [5, league_id, JSON.stringify(shuffledTeams), 0, 0, date]
    );

    // Round 6
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [6, league_id, JSON.stringify(reverseShuffle), 0, 0, date]
    );

    // Round 7
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [7, league_id, JSON.stringify(shuffledTeams), 0, 0, date]
    );

    // Round 8
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `pick_order`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [8, league_id, JSON.stringify(reverseShuffle), 0, 0, date]
    );

    const league = await mysql(
      'SELECT * FROM league WHERE id = ?',
      [league_id]
    );

    const schedule = JSON.parse(league[0].draft_schedule);
    const draftDate = `${schedule.date.month} ${schedule.date.day}, ${schedule.date.year}`;

    await sendLeagueDraftSchedule(league[0].name, league[0].segment, draftDate);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Create Draft',
    });
  }
};

module.exports.startDraft = async (req, res) => {
  const { league_id } = req.params;
  const date = new Date().toISOString();

  try {
    await mysql('UPDATE league SET draft_active = ? WHERE id = ?', [
      1,
      league_id,
    ]);
    await mysql(
      'UPDATE draft SET active = ?, start_time = ? WHERE league_id = ? AND round = ?',
      [1, date, league_id, 1]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Start Draft',
    });
  }
};

module.exports.draftNextRound = async (req, res) => {
  const { league_id } = req.params;

  try {
    const draft = await mysql(
      'SELECT * FROM draft WHERE league_id = ? AND active = ?',
      [league_id, 1]
    );

    if (!draft.length) {
      return res.status(400).json({
        message: 'There are no active rounds in this draft',
      });
    }

    const round = draft[0].round;
    const nextRound = draft[0].next;

    if (round === nextRound) {
      return res
        .status(200)
        .json({ newRound: nextRound, draftComplete: nextRound === 9 });
    }

    await mysql(
      'UPDATE draft SET active = ? WHERE league_id = ? AND round = ? AND next = ?',
      [0, league_id, round, nextRound]
    );

    if (nextRound < 9) {
      const date = new Date().toISOString();

      await mysql(
        'UPDATE draft SET active = ?, start_time = ?, pick_order = ?, next = ? WHERE league_id = ? AND round = ?',
        [1, date, 0, nextRound, league_id, nextRound]
      );
    }

    // Draft is complete
    // Start League
    if (nextRound === 9) {
      await mysql(
        'UPDATE league SET draft_active = ?, draft_complete = ?, week = ? WHERE id = ?',
        [0, 1, 0, league_id]
      );

      const members = await mysql(
        'SELECT id, points FROM league_members WHERE league_id = ?',
        [league_id]
      );

      const league = await mysql('SELECT num_bench FROM league WHERE id = ?', [
        league_id,
      ]);

      for (let index = 0; index < members.length; index++) {
        const additionalBenchPoints = league[0].num_bench * 400;
        const totalTeamPoints = members[index].points + additionalBenchPoints;

        await mysql(
          'UPDATE team SET week = ? WHERE league_member_id = ? AND week = ?',
          [0, members[index].id, -1]
        );

        await mysql('UPDATE league_members SET points = ? WHERE id = ?', [
          totalTeamPoints,
          members[index].id,
        ]);
      }
    }

    return res
      .status(200)
      .json({ newRound: nextRound, draftComplete: nextRound === 9 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Start Draft',
    });
  }
};

module.exports.addDraftPlayers = async (req, res) => {
  const { team_id } = req.params;
  const { thePlayers, teams, pick, draftId, pickOrder, leagueId, round } =
    req.body;

  try {
    if (thePlayers) {
      // Add Draft Player
      const {
        captain,
        brawlerA,
        brawlerB,
        bsBrawler,
        bsSupport,
        support,
        villain,
        battlefield,
      } = thePlayers;

      const team = await mysql(
        'SELECT t.league_member_id, t.affinity, t.activeAffinity, l.week FROM team t, league l, league_members lm WHERE t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id AND t.week = l.week',
        [team_id]
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

      const { userPoints, allowedPoints } = await getUserPoints(characterIds);

      if (userPoints < 0) {
        return res.status(400).json({
          message: `The Scouter says your power level is OVER ${allowedPoints}! Please choose another character`,
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
    }

    const date = new Date().toISOString();

    // Update Draft
    await mysql(
      'UPDATE draft SET teams = ?, recent_pick = ?, pick_order = ?, start_time = ? WHERE id = ? AND active = ?',
      [teams, pick, pickOrder + 1, date, draftId, 1]
    );

    const leagueNum = await mysql('SELECT num_teams FROM league WHERE id = ?', [
      leagueId,
    ]);

    const newRound = pickOrder + 1;
    if (newRound === leagueNum[0].num_teams) {
      await mysql('UPDATE draft SET next = ? WHERE id = ?', [
        round + 1,
        draftId,
      ]);
    }

    const members = await mysql(
      'SELECT * FROM league_members WHERE league_id = ?',
      [leagueId]
    );

    for (let index = 0; index < members.length; index++) {
      await mysql(
        'UPDATE league_members SET draft_reset_timer = ? WHERE user_id = ? AND league_id = ?',
        [1, members[index].user_id, leagueId]
      );
    }

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
