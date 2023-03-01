const mysql = require('../../utils/mysql').instance();

module.exports.createBracket = async (req, res) => {
  const { bracket } = req.body;
  const { userId } = req.user;
  const {
    player1,
    player2,
    player3,
    player4,
    player5,
    player6,
    player7,
    player8,
    player9,
    player10,
    player11,
    player12,
    player13,
    player14,
    player15,
    player16,
    player17,
    player18,
    player19,
    player20,
    player21,
    player22,
    player23,
    player24,
  } = bracket;

  console.log(bracket);

  try {
    const newBracket = await mysql(
      'INSERT INTO `bracket` (`creator_id`, `active`, `round`, `player_1`, `player_2`, `player_3`, `player_4`, `player_5`, `player_6`, `player_7`, `player_8`, `player_9`, `player_10`, `player_11`, `player_12`, `player_13`, `player_14`, `player_15`, `player_16`, `player_17`, `player_18`, `player_19`, `player_20`, `player_21`, `player_22`, `player_23`, `player_24`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        1,
        0,
        player1.id,
        player2.id,
        player3.id,
        player4.id,
        player5.id,
        player6.id,
        player7.id,
        player8.id,
        player9.id,
        player10.id,
        player11.id,
        player12.id,
        player13.id,
        player14.id,
        player15.id,
        player16.id,
        player17.id,
        player18.id,
        player19.id,
        player20.id,
        player21.id,
        player22.id,
        player23.id,
        player24.id,
      ]
    );

    return res.status(200).json({
      bracketId: newBracket.insertId,
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

module.exports.getBracket = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    const bracket = await mysql('SELECT * FROM bracket WHERE id = ?', [
      bracket_id,
    ]);

    const bracketIds = [
      bracket[0].player_1,
      bracket[0].player_2,
      bracket[0].player_3,
      bracket[0].player_4,
      bracket[0].player_5,
      bracket[0].player_6,
      bracket[0].player_7,
      bracket[0].player_8,
      bracket[0].player_9,
      bracket[0].player_10,
      bracket[0].player_11,
      bracket[0].player_12,
      bracket[0].player_13,
      bracket[0].player_14,
      bracket[0].player_15,
      bracket[0].player_16,
      bracket[0].player_17,
      bracket[0].player_18,
      bracket[0].player_19,
      bracket[0].player_20,
      bracket[0].player_21,
      bracket[0].player_22,
      bracket[0].player_23,
      bracket[0].player_24,
    ];

    const players = await mysql('SELECT * FROM players WHERE id in (?)', [
      bracketIds,
    ]);

    return res.status(200).json(players);
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Get bracket',
    });
  }
};

module.exports.getAllBrackets = async (req, res) => {
  const { userId } = req.user;

  try {
    const brackets = await mysql('SELECT * FROM bracket WHERE creator_id = ?', [
      userId,
    ]);

    return res.status(200).json(brackets);
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Get all brackets',
    });
  }
};
