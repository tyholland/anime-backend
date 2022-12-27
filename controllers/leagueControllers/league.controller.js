const mysql = require('../../utils/mysql').instance();

const createNewTeam = (userId, leagueId, res) => {
  mysql.query(
    'INSERT INTO `league_members` (`user_id`, `league_id`) VALUES (?, ?)',
    [userId, leagueId],
    (error, members) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'create league member',
        });
      }

      mysql.query(
        'INSERT INTO `team` (`league_member_id`, `week`) VALUES (?, ?)',
        [members.insertId, 1],
        (error, team) => {
          if (error) {
            return res.status(500).json({
              ...error,
              action: 'add new team',
            });
          }

          mysql.query(
            'SELECT * FROM team t, league_members l WHERE t.league_member_id = l.id ORDER BY l.id = ?',
            [members.insertId],
            (error, data) => {
              if (error) {
                return res.status(500).json({
                  ...error,
                  action: 'get all team and league member info',
                });
              }

              mysql.query(
                'SELECT * FROM league WHERE id = ?',
                [data[0].league_id],
                (error, league) => {
                  if (error) {
                    return res.status(500).json({
                      ...error,
                      action: 'get league after create',
                    });
                  }

                  return res.status(200).json({
                    leagueId: data[0].league_id,
                    leagueName: league[0].name,
                    teamId: team.insertId,
                    teamName: data[0].team_name,
                    week: data[0].week,
                    players: {
                      captain: data[0].captain,
                      brawlerA: data[0].brawler_a,
                      brawlerB: data[0].brawler_b,
                      bsBrawler: data[0].bs_brawler,
                      bsSupport: data[0].bs_support,
                      support: data[0].support,
                      villain: data[0].villain,
                      battlefield: data[0].battlefield,
                      benchA: data[0].bench_a,
                      benchB: data[0].bench_b,
                      benchC: data[0].bench_c,
                      benchD: data[0].bench_d,
                      benchE: data[0].bench_e,
                    },
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports.getLeague = (req, res) => {
  const { id } = req.params;

  mysql.query('SELECT * FROM league WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'get league',
      });
    }

    return res.status(200).json(results);
  });
};

module.exports.getAllLeagues = (req, res) => {
  const { userId } = req.params;

  mysql.query(
    'SELECT * FROM league_members WHERE user_id = ?',
    [userId],
    (error, leagues) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league members',
        });
      }

      const leagueIds = [];

      leagues.forEach((item) => {
        const { id } = item;

        leagueIds.push(id);
      });

      mysql.query(
        'SELECT * FROM league WHERE id IN (?)',
        [leagueIds],
        (error, results) => {
          if (error) {
            return res.status(500).json({
              ...error,
              action: 'get league',
            });
          }

          return res.status(200).json(results);
        }
      );
    }
  );
};

module.exports.createLeague = (req, res) => {
  const { name, userId, numTeams } = req.body;
  const date = new Date().toISOString();

  mysql.query(
    'INSERT INTO `league` (`name`, `num_teams`, `active`, `creator_id`, `has_ended`, `create_date`) VALUES (?, ?, ?, ?, ?, ?)',
    [name, numTeams, 1, userId, 0, date],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'add league',
        });
      }

      return createNewTeam(userId, results.insertId, res);
    }
  );
};

module.exports.joinLeague = (req, res) => {
  const { user_id } = req.body;
  const { id } = req.param;

  mysql.query(
    'SELECT * FROM league_members WHERE user_id = ?',
    [user_id],
    (error, leagues) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league members',
        });
      }

      if (leagues.user_id === user_id && leagues.league_id === id) {
        return res.status(500).json({
          ...error,
          action: `user already exists in the league id ${id}`,
        });
      }

      createNewTeam(user_id, id, res);
    }
  );
};

module.exports.updateLeague = (req, res) => {
  const { name, teams, isActive, hasEnded, teamId, userId } = req.body;

  mysql.query(
    'UPDATE league SET name = ?, num_teams = ?, active = ?, has_ended = ? WHERE id = ? and user_id = ?',
    [name, teams, isActive, hasEnded, teamId, userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'update league',
        });
      }

      return res.status(200).json(results);
    }
  );
};

module.exports.deleteLeague = (req, res) => {
  const { id } = req.params;

  mysql.query('DELETE FROM league WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'delete league',
      });
    }

    mysql.query(
      'DELETE FROM league_members WHERE league_id = ?',
      [id],
      (error) => {
        if (error) {
          return res.status(500).json({
            ...error,
            action: 'delete league members',
          });
        }

        return res.status(200).json({
          success: true,
        });
      }
    );
  });
};
