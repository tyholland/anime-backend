const { getFullTeamMatchupPoints } = require('../../utils/query');

const mysql = require('../../utils/mysql').instance();

module.exports.getMatchup = async (req, res) => {
  const { matchup_id } = req.params;
  const { userId } = req.user;

  try {
    const matchup = await mysql('SELECT * FROM matchup WHERE id = ?', [
      matchup_id,
    ]);

    const user = await mysql(
      'SELECT * from league_members lm, matchup m WHERE m.id = ? AND m.league_id = lm.league_id AND lm.user_id = ?',
      [matchup_id, userId]
    );

    if (!user.length) {
      return res.status(400).json({
        message: 'You are not a user in the league for this matchup.',
      });
    }

    const scoreA = await getFullTeamMatchupPoints(
      matchup[0].team_a,
      'team_b',
      matchup_id
    );
    const scoreB = await getFullTeamMatchupPoints(
      matchup[0].team_b,
      'team_a',
      matchup_id
    );

    await mysql('UPDATE matchup SET score_a = ?, score_b = ? WHERE id = ?', [
      scoreA,
      scoreB,
      matchup_id,
    ]);

    const newMatchupData = await mysql('SELECT * FROM matchup WHERE id = ?', [
      matchup_id,
    ]);

    return res.status(200).json(newMatchupData);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get Matchup',
    });
  }
};

module.exports.getMatchupFromTeam = async (req, res) => {
  const { team_id } = req.params;
  const { userId } = req.user;

  try {
    const matchupData = await mysql(
      'SELECT m.id as matchupId FROM team t, matchup m WHERE t.id = ? AND t.week = m.week AND (t.id = m.team_a OR t.id = m.team_b)',
      [team_id]
    );

    const user = await mysql(
      'SELECT * from league_members lm, matchup m WHERE m.id = ? AND m.league_id = lm.league_id AND lm.user_id = ?',
      [matchupData[0].matchupId, userId]
    );

    if (!user.length) {
      return res.status(400).json({
        message: 'You are not a user in the league for this matchup.',
      });
    }

    return res.status(200).json(matchupData);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get matchup from team',
    });
  }
};

module.exports.createMatchupVotes = async (req, res) => {
  const { matchup_id } = req.params;
  const { rank } = req.body;
  const { userId } = req.user;
  const date = new Date().toISOString();

  try {
    const existingMatchup = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND rank = ? AND active = ?',
      [matchup_id, rank, 1]
    );

    if (existingMatchup.length) {
      return res.status(400).json({
        message: 'This matchup already exists.',
      });
    }

    const matchup = await mysql(
      'SELECT m.team_a, m.team_b FROM matchup m, league_members lm, team t WHERE m.id = ? AND (m.team_a = t.id OR m.team_b = t.id) AND t.league_member_id = lm.id AND lm.user_id = ?',
      [matchup_id, userId]
    );

    if (!matchup.length) {
      return res.status(400).json({
        message: 'There is no matchup available.',
      });
    }

    const { team_a, team_b } = matchup[0];

    const teams = await mysql('SELECT * FROM team WHERE id in (?)', [
      [team_a, team_b],
    ]);

    const newVote = await mysql(
      'INSERT INTO `votes` (`initiator_id`, `matchup_id`, `player_a_id`, `player_b_id`, `player_a_count`, `player_b_count`, `rank`, `active`, `create_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, matchup_id, teams[0][rank], teams[1][rank], 0, 0, rank, 1, date]
    );

    return res.status(200).json({
      matchupVoteId: newVote.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Create matchup voting',
    });
  }
};

module.exports.getMatchupVotes = async (req, res) => {
  const { vote_id } = req.params;

  try {
    const votes = await mysql(
      'SELECT v.active, v.player_a_id, v.player_b_id, v.player_a_count, v.player_b_count, l.name as leagueName FROM votes v, matchup m, league l WHERE v.id = ? AND v.active = ? AND v.matchup_id = m.id AND m.league_id = l.id',
      [vote_id, 1]
    );

    if (!votes.length) {
      return res.status(400).json({
        message: 'There is no matchup available to vote on',
      });
    }

    return res.status(200).json(votes[0]);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get Matchup votes',
    });
  }
};

module.exports.getAllMatchupVotes = async (req, res) => {
  try {
    const votes = await mysql(
      'SELECT v.id, v.active, v.player_a_id, v.player_b_id, v.player_a_count, v.player_b_count, l.name as leagueName FROM votes v, matchup m, league l WHERE v.active = ? AND v.matchup_id = m.id AND m.league_id = l.id',
      [1]
    );

    if (!votes.length) {
      return res.status(400).json({
        message: 'There are no matchups available to vote on',
      });
    }

    return res.status(200).json(votes);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get all matchup votes',
    });
  }
};
