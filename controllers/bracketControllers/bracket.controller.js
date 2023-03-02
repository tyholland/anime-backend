const {
  bracketMatchup,
  filterBracketVotingStatus,
  filterBracketVotingScores,
  filterBracketVotingWinner,
  filterBracketVotingId,
} = require('../../utils');

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

  try {
    const newBracket = await mysql(
      'INSERT INTO `bracket` (`creator_id`, `active`, `round`, `player_1`, `player_2`, `player_3`, `player_4`, `player_5`, `player_6`, `player_7`, `player_8`, `player_9`, `player_10`, `player_11`, `player_12`, `player_13`, `player_14`, `player_15`, `player_16`, `player_17`, `player_18`, `player_19`, `player_20`, `player_21`, `player_22`, `player_23`, `player_24`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    console.log(error);
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

    const round1Players = [
      {
        p1: bracket[0].player_1,
        p2: 'Bye',
        score1: 1,
        score2: 0,
        hasEnded: true,
        round: 1,
        voteId: null,
      },
      {
        p1: bracket[0].player_2,
        p2: bracket[0].player_3,
        score1: filterBracketVotingScores(voting, 'game_2', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_2', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_2'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_2'),
      },
      {
        p1: bracket[0].player_4,
        p2: bracket[0].player_5,
        score1: filterBracketVotingScores(voting, 'game_3', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_3', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_3'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_3'),
      },
      {
        p1: bracket[0].player_6,
        p2: bracket[0].player_7,
        score1: filterBracketVotingScores(voting, 'game_4', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_4', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_4'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_4'),
      },
      {
        p1: bracket[0].player_8,
        p2: bracket[0].player_9,
        score1: filterBracketVotingScores(voting, 'game_5', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_5', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_5'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_5'),
      },
      {
        p1: bracket[0].player_10,
        p2: bracket[0].player_11,
        score1: filterBracketVotingScores(voting, 'game_6', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_6', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_6'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_6'),
      },
      {
        p1: bracket[0].player_12,
        p2: 'Bye',
        score1: 1,
        score2: 0,
        hasEnded: true,
        round: 1,
        voteId: null,
      },
      {
        p1: bracket[0].player_13,
        p2: 'Bye',
        score1: 1,
        score2: 0,
        hasEnded: true,
        round: 1,
        voteId: null,
      },
      {
        p1: bracket[0].player_14,
        p2: bracket[0].player_15,
        score1: filterBracketVotingScores(voting, 'game_9', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_9', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_9'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_9'),
      },
      {
        p1: bracket[0].player_16,
        p2: bracket[0].player_17,
        score1: filterBracketVotingScores(voting, 'game_10', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_10', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_10'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_10'),
      },
      {
        p1: bracket[0].player_18,
        p2: bracket[0].player_19,
        score1: filterBracketVotingScores(voting, 'game_11', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_11', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_11'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_11'),
      },
      {
        p1: bracket[0].player_20,
        p2: bracket[0].player_21,
        score1: filterBracketVotingScores(voting, 'game_12', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_12', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_12'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_12'),
      },
      {
        p1: bracket[0].player_22,
        p2: bracket[0].player_23,
        score1: filterBracketVotingScores(voting, 'game_13', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_13', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_13'),
        round: 1,
        voteId: filterBracketVotingId(voting, 'game_13'),
      },
      {
        p1: bracket[0].player_24,
        p2: 'Bye',
        score1: 1,
        score2: 0,
        hasEnded: true,
        round: 1,
        voteId: null,
      },
    ];
    const round1 = [];

    const round2Players = [
      {
        p1: bracket[0].player_1,
        p2: filterBracketVotingWinner(voting, 'game_2', '2'),
        score1: filterBracketVotingScores(voting, 'game_15', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_15', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_15'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_15'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_3', '3'),
        p2: filterBracketVotingWinner(voting, 'game_4', '4'),
        score1: filterBracketVotingScores(voting, 'game_16', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_16', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_16'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_16'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_5', '5'),
        p2: 'Bye',
        score1: 1,
        score2: 0,
        hasEnded: filterBracketVotingStatus(voting, 'game_5'),
        round: 2,
        voteId: null,
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_6', '6'),
        p2: bracket[0].player_12,
        score1: filterBracketVotingScores(voting, 'game_18', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_18', 'player_a_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_18'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_18'),
      },
      {
        p1: bracket[0].player_13,
        p2: filterBracketVotingWinner(voting, 'game_9', '9'),
        score1: filterBracketVotingScores(voting, 'game_19', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_19', 'player_a_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_19'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_19'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_10', '10'),
        p2: filterBracketVotingWinner(voting, 'game_11', '11'),
        score1: filterBracketVotingScores(voting, 'game_20', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_20', 'player_a_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_20'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_20'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_12', '12'),
        p2: 'Bye',
        score1: 1,
        score2: 0,
        hasEnded: filterBracketVotingStatus(voting, 'game_12'),
        round: 2,
        voteId: null,
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_13', '13'),
        p2: bracket[0].player_24,
        score1: filterBracketVotingScores(voting, 'game_22', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_22', 'player_a_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_22'),
        round: 2,
        voteId: filterBracketVotingId(voting, 'game_22'),
      },
    ];
    const round2 = [];

    const round3Players = [
      {
        p1: filterBracketVotingWinner(voting, 'game_15', '15'),
        p2: filterBracketVotingWinner(voting, 'game_16', '16'),
        score1: filterBracketVotingScores(voting, 'game_23', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_23', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_23'),
        round: 3,
        voteId: filterBracketVotingId(voting, 'game_23'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_5', '5'),
        p2: filterBracketVotingWinner(voting, 'game_18', '18'),
        score1: filterBracketVotingScores(voting, 'game_24', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_24', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_24'),
        round: 3,
        voteId: filterBracketVotingId(voting, 'game_24'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_19', '19'),
        p2: filterBracketVotingWinner(voting, 'game_20', '20'),
        score1: filterBracketVotingScores(voting, 'game_25', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_25', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_25'),
        round: 3,
        voteId: filterBracketVotingId(voting, 'game_25'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_12', '12'),
        p2: filterBracketVotingWinner(voting, 'game_22', '22'),
        score1: filterBracketVotingScores(voting, 'game_26', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_26', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_26'),
        round: 3,
        voteId: filterBracketVotingId(voting, 'game_26'),
      },
    ];
    const round3 = [];

    const round4Players = [
      {
        p1: filterBracketVotingWinner(voting, 'game_23', '23'),
        p2: filterBracketVotingWinner(voting, 'game_24', '24'),
        score1: filterBracketVotingScores(voting, 'game_27', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_27', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_27'),
        round: 4,
        voteId: filterBracketVotingId(voting, 'game_27'),
      },
      {
        p1: filterBracketVotingWinner(voting, 'game_25', '25'),
        p2: filterBracketVotingWinner(voting, 'game_26', '26'),
        score1: filterBracketVotingScores(voting, 'game_28', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_28', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_28'),
        round: 4,
        voteId: filterBracketVotingId(voting, 'game_28'),
      },
    ];
    const round4 = [];

    const round5Players = [
      {
        p1: filterBracketVotingWinner(voting, 'game_27', '27'),
        p2: filterBracketVotingWinner(voting, 'game_28', '28'),
        score1: filterBracketVotingScores(voting, 'game_29', 'player_a_count'),
        score2: filterBracketVotingScores(voting, 'game_29', 'player_b_count'),
        hasEnded: filterBracketVotingStatus(voting, 'game_29'),
        round: 5,
        voteId: filterBracketVotingId(voting, 'game_29'),
      },
    ];
    const round5 = [];

    round1Players.forEach((item, index) => {
      round1.push(bracketMatchup(players, item, index + 1));
    });

    round2Players.forEach((item, index) => {
      const count = index + 15;
      round2.push(bracketMatchup(players, item, count));
    });

    round3Players.forEach((item, index) => {
      const count = index + 23;
      round3.push(bracketMatchup(players, item, count));
    });

    round4Players.forEach((item, index) => {
      const count = index + 27;
      round4.push(bracketMatchup(players, item, count));
    });

    round5Players.forEach((item, index) => {
      const count = index + 29;
      round5.push(bracketMatchup(players, item, count));
    });

    const allMatches = [...round1, ...round2, ...round3, ...round4, ...round5];

    return res.status(200).json({
      allMatches,
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
