const mysql = require('../../utils/mysql').instance();

const formatTeam = (data, res) => {
  const {
    captain,
    brawler_a,
    brawler_b,
    bs_brawler,
    bs_support,
    support,
    villain,
    battlefield,
    bench_a,
    bench_b,
    bench_c,
    bench_d,
    bench_e,
    week,
    points,
  } = data;
  let characterIds = [3, 4];

  if (
    !captain &&
    !brawler_a &&
    !brawler_b &&
    !bs_brawler &&
    !bs_support &&
    !support &&
    !villain &&
    !battlefield &&
    !bench_a &&
    !bench_b &&
    !bench_c &&
    !bench_d &&
    !bench_e
  ) {
    return {
      captain: {
        id: null,
      },
      brawler_a: {
        id: null,
      },
      brawler_b: {
        id: null,
      },
      bs_brawler: {
        id: null,
      },
      bs_support: {
        id: null,
      },
      support: {
        id: null,
      },
      villain: {
        id: null,
      },
      battlefield: {
        id: null,
      },
      bench_a: {
        id: null,
      },
      bench_b: {
        id: null,
      },
      bench_c: {
        id: null,
      },
      bench_d: {
        id: null,
      },
      bench_e: {
        id: null,
      },
      week,
      points,
    };
  }

  mysql.query(
    'SELECT * FROM players WHERE id in (?)',
    [characterIds.join(',')],
    (error) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get players in team',
        });
      }

      return {
        captain: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        brawler_a: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        brawler_b: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bs_brawler: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bs_support: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        support: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        villain: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        batllefield: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bench_a: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bench_b: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bench_c: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bench_d: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        bench_e: {
          id: '',
          name: '',
          points: '',
          affinity: [
            {
              type: '',
            },
          ],
        },
        week,
        points,
      };
    }
  );
};

module.exports.getTeam = (req, res) => {
  const { id, league_id } = req.params;

  mysql.query(
    'SELECT lm.id, lm.team_name, l.name FROM league_members as lm, league as l WHERE lm.user_id = ? AND lm.league_id = ? AND lm.league_id = l.id',
    [id, league_id],
    (error, member) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league members',
        });
      }

      mysql.query(
        'SELECT * FROM team WHERE league_member_id = ?',
        [member[0].id],
        (error, team) => {
          if (error) {
            return res.status(500).json({
              ...error,
              action: 'get league members',
            });
          }

          const teamDetails = formatTeam(team[0], res);

          return res.status(200).json({
            teamName: member[0].team_name,
            team: teamDetails,
            leagueName: member[0].name,
          });
        }
      );
    }
  );
};

module.exports.updateTeamName = (req, res) => {
  const { name, leagueId } = req.body;
  const { id } = req.params;

  mysql.query(
    'UPDATE league_members SET team_name = ? WHERE league_id = ? and user_id = ?',
    [name, leagueId, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'update league_members',
        });
      }

      return res.status(200).json(results);
    }
  );
};

module.exports.updateTeam = (req, res) => {
  const { id } = req.params;
  const {
    captain,
    brawlerA,
    brawlerB,
    bsBrawler,
    bsSupport,
    support,
    villain,
    battlefied,
    benchA,
    benchB,
    benchC,
    benchD,
    benchE,
    week,
    points,
  } = req.body;

  mysql.query(
    'UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, bench_a = ?, bench_b = ?, bench_c = ?, bench_d = ?, bench_e = ?, week = ?, points = ? WHERE league_member_id = ? and week = ?',
    [
      captain,
      brawlerA,
      brawlerB,
      bsBrawler,
      bsSupport,
      support,
      villain,
      battlefied,
      benchA,
      benchB,
      benchC,
      benchD,
      benchE,
      points,
      id,
      week,
    ],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'update team',
        });
      }

      return res.status(200).json(results);
    }
  );
};
