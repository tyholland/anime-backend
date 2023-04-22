const {
  stopRosterStartVoting,
  stopUserVoting,
  activateWeeklyAffinity,
  startNewWeek,
} = require('../../utils/query');
const {
  playoffsFinals,
  playoffsFirstRound,
  playoffsSemis,
  createSevenTeamSchedule,
  createNineTeamSchedule,
  createEightTeamSchedule,
  createSixTeamSchedule,
  createTenTeamSchedule,
} = require('../../utils/schedule');

module.exports.affinityRule = async (req, res) => {
  try {
    // Stop matchup voting
    await stopUserVoting();
    await activateWeeklyAffinity();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Run Affinity Rule',
    });
  }
};

module.exports.startRule = async (req, res) => {
  try {
    // Start new week or end league
    await startNewWeek();

    // Create playoffs schedule
    await playoffsFirstRound();
    await playoffsSemis();
    await playoffsFinals();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Run Start Rule',
    });
  }
};

module.exports.voteRule = async (req, res) => {
  try {
    // Stop users from changing their roster. Start matchup voting
    await stopRosterStartVoting();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Run Vote Rule',
    });
  }
};

module.exports.scheduleRule = async (req, res) => {
  try {
    // Create team schedule and matchups
    await createSixTeamSchedule();
    await createSevenTeamSchedule();
    await createEightTeamSchedule();
    await createNineTeamSchedule();
    await createTenTeamSchedule();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Run Schedule Rule',
    });
  }
};
