const mysql = require('../../utils/mysql').instance();

module.exports.getTeam = (req, res) => {
  const { leagueId } = req.body;
  const { id } = req.params;

  mysql.query('SELECT * FROM league_members WHERE league_id = ? and user_id = ?', [leagueId, id], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'get league_members'
      });
    }

    return res.status(200).json(results);
  });
};

module.exports.updateTeamName = (req, res) => {
  const { name, leagueId } = req.body;
  const { id } = req.params;

  mysql.query('UPDATE league_members SET team_name = ? WHERE league_id = ? and user_id = ?', [name, leagueId, id], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'update league_members'
      });
    }

    return res.status(200).json(results);
  });
};

module.exports.updateTeam = (req, res) => {
  const { id } = req.params;
  const { captain, brawlerA, brawlerB, bsBrawler, bsSupport, support, villain, battlefied, benchA, benchB, benchC, benchD, benchE, week, points } = req.body;

  mysql.query('UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, bench_a = ?, bench_b = ?, bench_c = ?, bench_d = ?, bench_e = ?, week = ?, points = ? WHERE league_member_id = ? and week = ?', [captain, brawlerA, brawlerB, bsBrawler, bsSupport, support, villain, battlefied, benchA, benchB, benchC, benchD, benchE, points, id, week], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'update team'
      });
    }

    return res.status(200).json(results);
  });
};

