const {
  shuffleArray,
  getAffinitiesTypes,
  getBoostPoints,
} = require('../../utils');
const { getUserPoints } = require('../../utils/team');
const mysql = require('../../utils/mysql').instance();

module.exports.getDraft = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    const league = await mysql(
      'SELECT * FROM league WHERE id = ? AND draft_active = ? AND draft_complete = ?',
      [league_id, 1, 0]
    );

    if (!league.length) {
      return res.status(400).json({
        message: 'This draft is not active at the moment',
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
      action: 'Get Draft',
    });
  }
};

module.exports.updateDraftTeams = async (req, res) => {
  const { teams } = req.body;
  const { draft_id } = req.params;

  try {
    await mysql('UPDATE draft SET teams = ? WHERE id = ?', [teams, draft_id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Update Draft Teams',
    });
  }
};

module.exports.updateDraftRecentPick = async (req, res) => {
  const { pick } = req.body;
  const { draft_id } = req.params;

  try {
    await mysql('UPDATE draft SET recent_pick = ? WHERE id = ?', [
      pick,
      draft_id,
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Update Draft Recent Pick',
    });
  }
};

module.exports.createDraft = async (req, res) => {
  const { league_id } = req.params;
  const date = new Date().toISOString();

  try {
    const teams = await mysql(
      'SELECT * FROM league_members WHERE league_id = ?',
      [league_id]
    );
    const shuffledTeams = shuffleArray(teams);
    const destructiveArr = [...shuffledTeams];
    const reverseShuffle = destructiveArr.reverse();
    const time = teams.length * 60;

    // Round 1
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [1, league_id, JSON.stringify(shuffledTeams), time, 0, date]
    );

    // Round 2
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [2, league_id, JSON.stringify(reverseShuffle), time, 0, date]
    );

    // Round 3
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [3, league_id, JSON.stringify(shuffledTeams), time, 0, date]
    );

    // Round 4
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [4, league_id, JSON.stringify(reverseShuffle), time, 0, date]
    );

    // Round 5
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [5, league_id, JSON.stringify(shuffledTeams), time, 0, date]
    );

    // Round 6
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [6, league_id, JSON.stringify(reverseShuffle), time, 0, date]
    );

    // Round 7
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [7, league_id, JSON.stringify(shuffledTeams), time, 0, date]
    );

    // Round 8
    await mysql(
      'INSERT INTO `draft` (`round`, `league_id`, `teams`, `time`, `active`, `start_time`) VALUES (?, ?, ?, ?, ?, ?)',
      [8, league_id, JSON.stringify(reverseShuffle), time, 0, date]
    );

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

  try {
    await mysql('UPDATE league SET draft_active = ? WHERE id = ?', [
      1,
      league_id,
    ]);
    await mysql(
      'UPDATE draft SET active = ? WHERE league_id = ? AND round = ?',
      [1, league_id, 1]
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
    const nextRound = round + 1;

    await mysql(
      'UPDATE draft SET active = ? WHERE league_id = ? AND round = ?',
      [0, league_id, round]
    );

    if (nextRound < 9) {
      await mysql(
        'UPDATE draft SET active = ? WHERE league_id = ? AND round = ?',
        [1, league_id, nextRound]
      );
    }

    if (nextRound === 9) {
      await mysql(
        'UPDATE league SET draft_active = ?, draft_complete = ? WHERE id = ?',
        [0, 1, league_id]
      );
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

    const userPoints = await getUserPoints(characterIds);

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
