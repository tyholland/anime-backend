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

module.exports.createBracketFirstRound = async (bracketId) => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ? AND id = ?',
      [0, 0, bracketId]
    );

    await insertNewBracketVoting(
      bracket[0].player_1,
      bracket[0].player_2,
      'game_1',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_3,
      bracket[0].player_4,
      'game_2',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_5,
      bracket[0].player_6,
      'game_3',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_7,
      bracket[0].player_8,
      'game_4',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_9,
      bracket[0].player_10,
      'game_5',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_11,
      bracket[0].player_12,
      'game_6',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_13,
      bracket[0].player_14,
      'game_7',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      bracket[0].player_15,
      bracket[0].player_16,
      'game_8',
      bracket[0].id,
      bracket[0].creator_id
    );

    await mysql('UPDATE bracket SET round = ?, active = ? WHERE id = ?', [
      1,
      1,
      bracket[0].id,
    ]);
  } catch (err) {
    throw new Error('Can not create bracket first round');
  }
};

module.exports.createBracketSecondRound = async (bracketId) => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ? AND id = ?',
      [1, 1, bracketId]
    );

    const voting = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
      [bracket[0].id, 1]
    );

    const winner1 = await getGameWinner(voting, 'game_1');
    const winner2 = await getGameWinner(voting, 'game_2');
    const winner3 = await getGameWinner(voting, 'game_3');
    const winner4 = await getGameWinner(voting, 'game_4');
    const winner5 = await getGameWinner(voting, 'game_5');
    const winner6 = await getGameWinner(voting, 'game_6');
    const winner7 = await getGameWinner(voting, 'game_7');
    const winner8 = await getGameWinner(voting, 'game_8');

    // Create New Voting Matchups
    await insertNewBracketVoting(
      winner1,
      winner2,
      'game_9',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      winner3,
      winner4,
      'game_10',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      winner5,
      winner6,
      'game_11',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      winner7,
      winner8,
      'game_12',
      bracket[0].id,
      bracket[0].creator_id
    );

    // Update Bracket and old Matchups
    await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
      2,
      bracket[0].id,
    ]);
  } catch (err) {
    throw new Error('Can not create bracket second round');
  }
};

module.exports.createBracketThirdRound = async (bracketId) => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ? AND id = ?',
      [1, 2, bracketId]
    );

    const voting = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
      [bracket[0].id, 1]
    );

    const winner9 = await getGameWinner(voting, 'game_9');
    const winner10 = await getGameWinner(voting, 'game_10');
    const winner11 = await getGameWinner(voting, 'game_11');
    const winner12 = await getGameWinner(voting, 'game_12');

    // Create New Voting Matchups
    await insertNewBracketVoting(
      winner9,
      winner10,
      'game_13',
      bracket[0].id,
      bracket[0].creator_id
    );
    await insertNewBracketVoting(
      winner11,
      winner12,
      'game_14',
      bracket[0].id,
      bracket[0].creator_id
    );

    // Update Bracket and old Matchups
    await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
      3,
      bracket[0].id,
    ]);
  } catch (err) {
    throw new Error('Can not create bracket third round');
  }
};

module.exports.createBracketFinalRound = async (bracketId) => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ? AND id = ?',
      [1, 3, bracketId]
    );

    const voting = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
      [bracket[0].id, 1]
    );

    const winner13 = await getGameWinner(voting, 'game_13');
    const winner14 = await getGameWinner(voting, 'game_14');

    // Create New Voting Matchups
    await insertNewBracketVoting(
      winner13,
      winner14,
      'game_15',
      bracket[0].id,
      bracket[0].creator_id
    );

    // Update Bracket and old Matchups
    await mysql('UPDATE bracket SET round = ? WHERE id = ?', [
      4,
      bracket[0].id,
    ]);
  } catch (err) {
    throw new Error('Can not create bracket fourth round');
  }
};

module.exports.createBracketChamp = async (bracketId) => {
  try {
    const bracket = await mysql(
      'SELECT * FROM bracket WHERE active = ? AND round = ? AND id = ?',
      [1, 4, bracketId]
    );

    const voting = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND is_bracket = ?',
      [bracket[0].id, 1]
    );

    const winner15 = await getGameWinner(voting, 'game_15');

    // Update Bracket and old Matchups
    await mysql(
      'UPDATE bracket SET round = ?, active = ?, champ = ? WHERE id = ?',
      [5, 0, winner15, bracket[0].id]
    );
  } catch (err) {
    throw new Error('Can not create bracket champ');
  }
};

const filterPlayer = (arr, target) => {
  if (/#|Bye/.test(target)) {
    return {
      playerName: target,
      showShort: false,
    };
  }

  const playerName = arr.filter((item) => item.id === target)[0].name;
  const shortenName = playerName.match(/.{1,6}/g);

  return {
    shortenName: `${shortenName[0]}...`,
    playerName,
    showShort: playerName.length > 9,
  };
};

module.exports.bracketMatchup = (allPlayers, data, match) => {
  const { p1, p2, score1, score2, hasEnded, round, voteId } = data;
  const name1 = filterPlayer(allPlayers, p1);
  const name2 = filterPlayer(allPlayers, p2);

  return {
    homeTeamName: name1.showShort ? name1.shortenName : name1.playerName,
    awayTeamName: name2.showShort ? name2.shortenName : name2.playerName,
    round,
    matchNumber: match,
    homeTeamScore: score1,
    awayTeamScore: score2,
    matchAccepted: hasEnded,
    matchComplete: true,
    homeTeamId: p1,
    awayTeamId: p2,
    homeTeamFullName: name1.playerName,
    awayTeamFullName: name2.playerName,
    voteId,
  };
};

module.exports.filterBracketVotingStatus = (voting, game) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  return vote ? vote?.active === 0 : false;
};

module.exports.filterBracketVotingScores = (voting, game, player) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  return vote ? vote[player] : 0;
};

module.exports.filterBracketVotingWinner = (voting, game, match) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  if (vote) {
    if (vote.active !== 0) {
      return `#${match} Winner`;
    }

    return vote.player_a_count < vote.player_b_count
      ? vote.player_b_id
      : vote.player_a_id;
  }

  return `#${match} Winner`;
};

module.exports.filterBracketVotingId = (voting, game) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  return vote ? vote.id : null;
};
