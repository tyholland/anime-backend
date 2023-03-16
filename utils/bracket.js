const mysql = require('./mysql').instance();

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
        bracket[index].player_1,
        bracket[index].player_2,
        'game_1',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_3,
        bracket[index].player_4,
        'game_2',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_5,
        bracket[index].player_6,
        'game_3',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_7,
        bracket[index].player_8,
        'game_4',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_9,
        bracket[index].player_10,
        'game_5',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_11,
        bracket[index].player_12,
        'game_6',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_13,
        bracket[index].player_14,
        'game_7',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        bracket[index].player_15,
        bracket[index].player_16,
        'game_8',
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

      const winner1 = getGameWinner(voting, 'game_1');
      const winner2 = getGameWinner(voting, 'game_2');
      const winner3 = getGameWinner(voting, 'game_3');
      const winner4 = getGameWinner(voting, 'game_4');
      const winner5 = getGameWinner(voting, 'game_5');
      const winner6 = getGameWinner(voting, 'game_6');
      const winner7 = getGameWinner(voting, 'game_7');
      const winner8 = getGameWinner(voting, 'game_8');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        winner1,
        winner2,
        'game_9',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner3,
        winner4,
        'game_10',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner5,
        winner6,
        'game_11',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner7,
        winner8,
        'game_12',
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

      const winner9 = getGameWinner(voting, 'game_9');
      const winner10 = getGameWinner(voting, 'game_10');
      const winner11 = getGameWinner(voting, 'game_11');
      const winner12 = getGameWinner(voting, 'game_12');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        winner9,
        winner10,
        'game_13',
        bracket[index].id,
        bracket[index].creator_id
      );
      await insertNewBracketVoting(
        winner11,
        winner12,
        'game_14',
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

module.exports.createBracketFinalRound = async () => {
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

      const winner13 = getGameWinner(voting, 'game_13');
      const winner14 = getGameWinner(voting, 'game_14');

      // Create New Voting Matchups
      await insertNewBracketVoting(
        winner13,
        winner14,
        'game_15',
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

module.exports.createBracketChamp = async () => {
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

      const winner15 = getGameWinner(voting, 'game_15');

      // Update Bracket and old Matchups
      await mysql(
        'UPDATE bracket SET round = ?, active = ?, champ = ? WHERE id = ?',
        [5, 0, winner15, bracket[index].id]
      );
    }
  } catch (err) {
    throw new Error('Can not create bracket champ');
  }
};
