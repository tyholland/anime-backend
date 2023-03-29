const { shuffleArray } = require('../../utils');

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
