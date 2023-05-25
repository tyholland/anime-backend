const { checkMatchupUserExists } = require('../../utils/query');
const { getFullTeamMatchupPoints } = require('../../utils/team');

const mysql = require('../../utils/mysql').instance();

module.exports.getMatchup = async (req, res) => {
  const { matchup_id } = req.params;
  const { userId } = req.user;

  try {
    const matchup = await mysql(
      'SELECT * FROM matchup WHERE id = ? AND (team_a != ? OR team_b != ?)',
      [matchup_id, 0, 0]
    );

    if (!matchup.length) {
      return res.status(400).json({
        message: 'This is a bye week matchup',
      });
    }

    await checkMatchupUserExists(userId, matchup_id, res);

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

    const league = await mysql(
      'SELECT is_voting_active FROM league WHERE id = ?',
      [newMatchupData[0].league_id]
    );

    const votes = await mysql(
      'SELECT * FROM votes WHERE matchup_id = ? AND active = ? AND is_bracket = ?',
      [matchup_id, 1, 0]
    );

    const userA = await mysql('SELECT lm.user_id FROM league_members lm, matchup m, team t WHERE m.id = ? AND m.team_a = t.id AND t.league_member_id = lm.id', [matchup_id]);

    const userB = await mysql('SELECT lm.user_id FROM league_members lm, matchup m, team t WHERE m.id = ? AND m.team_b = t.id AND t.league_member_id = lm.id', [matchup_id]);

    return res.status(200).json({
      matchup: newMatchupData[0],
      votes,
      isVotingActive: league[0].is_voting_active,
      isUser: userA[0].user_id === userId || userB[0].user_id === userId
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
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

    if (!matchupData.length) {
      return res.status(204).json([]);
    }

    await checkMatchupUserExists(userId, matchupData[0].matchupId, res);

    return res.status(200).json(matchupData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
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
      'SELECT * FROM votes WHERE matchup_id = ? AND `rank` = ? AND is_bracket = ?',
      [matchup_id, rank, 0]
    );

    if (existingMatchup.length) {
      return res.status(400).json({
        message: 'This matchup already exists.',
      });
    }

    const matchup = await mysql(
      'SELECT m.team_a, m.team_b, lm.league_id FROM matchup m, league_members lm, team t WHERE m.id = ? AND (m.team_a = t.id OR m.team_b = t.id) AND t.league_member_id = lm.id AND lm.user_id = ?',
      [matchup_id, userId]
    );

    if (!matchup.length) {
      return res.status(400).json({
        message: 'There is no matchup available.',
      });
    }

    const league = await mysql(
      'SELECT * FROM league WHERE id = ? AND is_voting_active = ?',
      [matchup[0].league_id, 1]
    );

    if (!league.length) {
      return res.status(400).json({
        message:
          'Voting is currently disabled. Please try again when voting becomes active.',
      });
    }

    const { team_a, team_b } = matchup[0];

    const teams = await mysql('SELECT * FROM team WHERE id in (?)', [
      [team_a, team_b],
    ]);

    const newVote = await mysql(
      'INSERT INTO `votes` (`initiator_id`, `matchup_id`, `player_a_id`, `player_b_id`, `player_a_count`, `player_b_count`, `rank`, `active`, `is_bracket`, `create_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        matchup_id,
        teams[0][rank],
        teams[1][rank],
        0,
        0,
        rank,
        1,
        0,
        date,
      ]
    );

    return res.status(200).json({
      matchupVoteId: newVote.insertId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Create matchup voting',
    });
  }
};

module.exports.getMatchupVotes = async (req, res) => {
  const { vote_id } = req.params;

  try {
    const votes = await mysql(
      'SELECT v.id, v.active, v.player_a_id, v.player_b_id, v.player_a_count, v.player_b_count, v.matchup_id, l.name as leagueName FROM votes v, matchup m, league l WHERE v.id = ? AND v.active = ? AND v.is_bracket = ? AND v.matchup_id = m.id AND m.league_id = l.id',
      [vote_id, 1, 0]
    );

    if (!votes.length) {
      return res.status(400).json({
        message: 'There is no matchup available to vote on',
      });
    }

    const allVotes = [];

    for (let index = 0; index < votes.length; index++) {
      const { matchup_id } = votes[index];

      const matchup = await mysql(
        'SELECT team_a, team_b FROM matchup WHERE id = ?',
        [matchup_id]
      );

      const teamA = await mysql(
        'SELECT lm.team_name FROM league_members lm, team t WHERE t.id = ? AND t.league_member_id = lm.id',
        [matchup[0].team_a]
      );

      const teamB = await mysql(
        'SELECT lm.team_name FROM league_members lm, team t WHERE t.id = ? AND t.league_member_id = lm.id',
        [matchup[0].team_b]
      );

      const currentVote = votes[index];
      allVotes.push({
        ...currentVote,
        teamA: teamA[0].team_name,
        teamB: teamB[0].team_name,
      });
    }

    return res.status(200).json(allVotes[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get Matchup votes',
    });
  }
};

module.exports.getAllMatchupVotes = async (req, res) => {
  const { currentUser } = req.body;

  try {
    let votes;

    if (currentUser) {
      const votedOn = await mysql(
        'SELECT v.id FROM votes v, votes_user vs WHERE v.active = ? AND v.id = vs.votes_id AND vs.user_id = ?',
        [1, currentUser.user_id]
      );

      const voteIds = [];
      votedOn.forEach((vote) => voteIds.push(vote.id));

      votes = voteIds.length
        ? await mysql(
          'SELECT id, active, player_a_id, player_b_id, player_a_count, player_b_count, matchup_id, is_bracket FROM votes WHERE NOT id IN (?) AND active = ?',
          [voteIds, 1]
        )
        : await mysql(
          'SELECT id, active, player_a_id, player_b_id, player_a_count, player_b_count, matchup_id, is_bracket FROM votes WHERE active = ?',
          [1]
        );
    }

    if (!currentUser) {
      votes = await mysql(
        'SELECT id, active, player_a_id, player_b_id, player_a_count, player_b_count, matchup_id, is_bracket FROM votes WHERE active = ?',
        [1]
      );
    }

    if (!votes.length) {
      return res.status(400).json({
        message: 'There are no matchups available to vote on',
      });
    }

    const allVotes = [];

    for (let index = 0; index < votes.length; index++) {
      const { matchup_id, is_bracket } = votes[index];
      const currentVote = votes[index];

      if (is_bracket) {
        const bracketInfo = await mysql(
          'SELECT name FROM bracket WHERE id = ?',
          [matchup_id]
        );

        allVotes.push({
          ...currentVote,
          bracket: bracketInfo[0].name
        });
      } else {
        const matchup = await mysql(
          'SELECT m.team_a, m.team_b, l.name as leagueName FROM matchup m, league l WHERE m.id = ? AND m.league_id = l.id',
          [matchup_id]
        );

        const teamA = await mysql(
          'SELECT lm.team_name FROM league_members lm, team t WHERE t.id = ? AND t.league_member_id = lm.id',
          [matchup[0].team_a]
        );

        const teamB = await mysql(
          'SELECT lm.team_name FROM league_members lm, team t WHERE t.id = ? AND t.league_member_id = lm.id',
          [matchup[0].team_b]
        );

        allVotes.push({
          ...currentVote,
          teamA: teamA[0].team_name,
          teamB: teamB[0].team_name,
          leagueName: matchup[0].leagueName
        });
      }
    }

    return res.status(200).json(allVotes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get all matchup votes',
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
      'SELECT * FROM matchup m, league l, votes v WHERE v.id = ? AND v.is_bracket = ? AND v.active = ? AND v.matchup_id = m.id AND m.league_id = l.id AND l.is_voting_active = ?',
      [voteId, 0, 1, 1]
    );

    if (!isVoteActive.length) {
      return res.status(400).json({
        message: 'Voting on this matchup is not available.',
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
