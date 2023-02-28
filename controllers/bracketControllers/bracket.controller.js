const mysql = require('../../utils/mysql').instance();

module.exports.createBracket = async (req, res) => {
  const { bracket } = req.body;
  const { userId } = req.user;
  const {
    player_1,
    player_2,
    player_3,
    player_4,
    player_5,
    player_6,
    player_7,
    player_8,
    player_9,
    player_10,
    player_11,
    player_12,
    player_13,
    player_14,
    player_15,
    player_16,
    player_17,
    player_18,
    player_19,
    player_20,
    player_21,
    player_22,
    player_23,
    player_24,
  } = bracket;

  try {
    await mysql(
      'INSERT INTO `bracket` (`creator_id`, `active`, `round`, `player_1`, `player_2`, `player_3`, `player_4`, `player_5`, `player_6`, `player_7`, `player_8`, `player_9`, `player_10`, `player_11`, `player_12`, `player_13`, `player_14`, `player_15`, `player_16`, `player_17`, `player_18`, `player_19`, `player_20`, `player_21`, `player_22`, `player_23`, `player_24`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        1,
        0,
        player_1,
        player_2,
        player_3,
        player_4,
        player_5,
        player_6,
        player_7,
        player_8,
        player_9,
        player_10,
        player_11,
        player_12,
        player_13,
        player_14,
        player_15,
        player_16,
        player_17,
        player_18,
        player_19,
        player_20,
        player_21,
        player_22,
        player_23,
        player_24,
      ]
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Create bracket',
    });
  }
};

module.exports.addVotes = async (req, res) => {
  const { userId } = req.user;
  const { voteId, votedFor, playerCount } = req.body;

  try {
    const isExistingVoter = await mysql(
      'SELECT * FROM votes_user WHERE user_id = ? AND votes_id = ?',
      [userId, voteId]
    );

    if (isExistingVoter.length) {
      return res.status(400).json({
        message: 'You already voted on this matchup',
      });
    }

    const isVoteActive = await mysql(
      'SELECT * FROM bracket b, votes v WHERE v.id = ? AND v.matchup_id = b.id AND b.active = ?',
      [voteId, 1]
    );

    if (!isVoteActive.length) {
      return res.status(400).json({
        message: 'You can not vote on bracket matchups right now.',
      });
    }

    await mysql(
      'INSERT INTO `votes_user` (`votes_id`, `user_id`, `vote_for_id`) VALUES (?, ?, ?)',
      [voteId, userId, votedFor]
    );

    const voteTotal = await mysql(
      'SELECT * FROM votes_user WHERE votes_id = ? AND vote_for_id = ?',
      [voteId, votedFor]
    );

    await mysql(`UPDATE votes SET ${playerCount} = ? WHERE id = ?`, [
      voteTotal.length,
      voteId,
    ]);

    return res.status(200).json({
      votes: voteTotal.length,
    });
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Add votes',
    });
  }
};
