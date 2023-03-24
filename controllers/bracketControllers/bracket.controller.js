const {
  bracketMatchup,
  filterBracketVotingStatus,
  filterBracketVotingScores,
  filterBracketVotingWinner,
  filterBracketVotingId,
  createBracketFirstRound,
  createBracketSecondRound,
  createBracketFinalRound,
  createBracketThirdRound,
  createBracketChamp,
} = require('../../utils/bracket');

const mysql = require('../../utils/mysql').instance();

module.exports.createBracket = async (req, res) => {
  const { bracket, name } = req.body;
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
  } = bracket;

  try {
    const newBracket = await mysql(
      'INSERT INTO `bracket` (`creator_id`, `active`, `round`, `player_1`, `player_2`, `player_3`, `player_4`, `player_5`, `player_6`, `player_7`, `player_8`, `player_9`, `player_10`, `player_11`, `player_12`, `player_13`, `player_14`, `player_15`, `player_16`, `name`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        0,
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
        name,
      ]
    );

    return res.status(200).json({
      bracketId: newBracket.insertId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Create bracket',
    });
  }
};

module.exports.addVotes = async (req, res) => {
  // const { userId } = req.user;
  const { voteId, votedFor, playerCount, userId } = req.body;

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
    console.log(error);
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

    const voting = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
      [bracket_id, 1]
    );

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
    ];

    const players = await mysql('SELECT * FROM players WHERE id in (?)', [
      bracketIds,
    ]);

    const round1Players = [
      {
        p1: bracket[0].player_1,
        p2: bracket[0].player_2,
        score1: filterBracketVotingScores(voting, 'game_1', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_1', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_1'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_1'),
      },
      {
        p1: bracket[0].player_3,
        p2: bracket[0].player_4,
        score1: filterBracketVotingScores(voting, 'game_2', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_2', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_2'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_2'),
      },
      {
        p1: bracket[0].player_5,
        p2: bracket[0].player_6,
        score1: filterBracketVotingScores(voting, 'game_3', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_3', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_3'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_3'),
      },
      {
        p1: bracket[0].player_7,
        p2: bracket[0].player_8,
        score1: filterBracketVotingScores(voting, 'game_4', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_4', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_4'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_4'),
      },
      {
        p1: bracket[0].player_9,
        p2: bracket[0].player_10,
        score1: filterBracketVotingScores(voting, 'game_5', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_5', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_5'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_5'),
      },
      {
        p1: bracket[0].player_11,
        p2: bracket[0].player_12,
        score1: filterBracketVotingScores(voting, 'game_6', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_6', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_6'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_6'),
      },
      {
        p1: bracket[0].player_13,
        p2: bracket[0].player_14,
        score1: filterBracketVotingScores(voting, 'game_7', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_7', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_7'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_7'),
      },
      {
        p1: bracket[0].player_15,
        p2: bracket[0].player_16,
        score1: filterBracketVotingScores(voting, 'game_8', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_8', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_8'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_8'),
      },
    ];
    const round1 = [];

    const round2Players = [
      {
        p1: filterBracketVotingWinner(voting, 'game_1', '1'),
        p2: filterBracketVotingWinner(voting, 'game_2', '2'),
        score1: filterBracketVotingScores(voting, 'game_9', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_9', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_9'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_9'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_3', '3'),
        p2: filterBracketVotingWinner(voting, 'game_4', '4'),
        score1: filterBracketVotingScores(voting, 'game_10', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_10', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_10'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_10'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_5', '5'),
        p2: filterBracketVotingWinner(voting, 'game_6', '6'),
        score1: filterBracketVotingScores(voting, 'game_11', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_11', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_11'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_11'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_7', '7'),
        p2: filterBracketVotingWinner(voting, 'game_8', '8'),
        score1: filterBracketVotingScores(voting, 'game_12', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_12', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_12'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_12'),
      },
    ];
    const round2 = [];

    const round3Players = [
      {
        p1: filterBracketVotingWinner(voting, 'game_9', '9'),
        p2: filterBracketVotingWinner(voting, 'game_10', '10'),
        score1: filterBracketVotingScores(voting, 'game_13', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_13', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_13'),
        round: 3,
        voteId: filterBracketVotingId(voting, 'game_13'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_11', '11'),
        p2: filterBracketVotingWinner(voting, 'game_12', '12'),
        score1: filterBracketVotingScores(voting, 'game_14', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_14', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_14'),
        round: 3,
        voteId: filterBracketVotingId(voting, 'game_14'),
      },
    ];
    const round3 = [];

    const round4Players = [
      {
        p1: filterBracketVotingWinner(voting, 'game_13', '13'),
        p2: filterBracketVotingWinner(voting, 'game_14', '14'),
        score1: filterBracketVotingScores(voting, 'game_15', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_15', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_15'),
        round: 4,
        voteId: filterBracketVotingId(voting, 'game_15'),
      },
    ];
    const round4 = [];

    round1Players.forEach((item, index) => {
      round1.push(bracketMatchup(players, item, index + 1));
    });

    round2Players.forEach((item, index) => {
      const count = index + 9;
      round2.push(bracketMatchup(players, item, count));
    });

    round3Players.forEach((item, index) => {
      const count = index + 13;
      round3.push(bracketMatchup(players, item, count));
    });

    round4Players.forEach((item, index) => {
      const count = index + 15;
      round4.push(bracketMatchup(players, item, count));
    });

    const allMatches = [...round1, ...round2, ...round3, ...round4];

    return res.status(200).json({
      allMatches,
      round: bracket[0].round,
      creator: bracket[0].creator_id,
      name: bracket[0].name,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get all brackets',
    });
  }
};

module.exports.startRound1 = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    await createBracketFirstRound(bracket_id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - start round 1',
    });
  }
};

module.exports.startRound2 = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    await createBracketSecondRound(bracket_id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - start round 2',
    });
  }
};

module.exports.startRound3 = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    await createBracketThirdRound(bracket_id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - start round 3',
    });
  }
};

module.exports.startRound4 = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    await createBracketFinalRound(bracket_id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - start round 4',
    });
  }
};

module.exports.startChampRound = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    await createBracketChamp(bracket_id);

    const bracket = await mysql('SELECT champ FROM bracket WHERE id = ?', [
      bracket_id,
    ]);

    const players = await mysql('SELECT full_name FROM players WHERE id = ?', [
      bracket[0].champ,
    ]);

    return res.status(200).json({ champ: players[0].full_name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - start champ round',
    });
  }
};

module.exports.getTheChamp = async (req, res) => {
  const { bracket_id } = req.params;

  try {
    const bracket = await mysql('SELECT champ FROM bracket WHERE id = ?', [
      bracket_id,
    ]);

    const players = await mysql('SELECT full_name FROM players WHERE id = ?', [
      bracket[0].champ,
    ]);

    return res.status(200).json({ champ: players[0].full_name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - get the champ',
    });
  }
};
