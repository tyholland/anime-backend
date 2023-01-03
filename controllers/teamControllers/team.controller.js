const mysql = require('../../utils/mysql').instance();
const {
  formatTeam,
  affinitiesTypes,
  getBoostPoints,
} = require('../../utils/index');

module.exports.getTeam = (req, res) => {
  const { id, league_id } = req.params;

  mysql.query(
    'SELECT lm.id, lm.team_name, lm.points as userPoints, l.name FROM league_members as lm, league as l WHERE lm.user_id = ? AND lm.league_id = ? AND lm.league_id = l.id',
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

          return formatTeam(team[0], member[0], res);
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
    battlefield,
    benchA,
    benchB,
    benchC,
    benchD,
    benchE,
  } = req.body;

  mysql.query(
    'SELECT t.league_member_id, l.week FROM team t, league l, league_members lm WHERE t.id = ? AND t.league_member_id = lm.league_id AND lm.league_id = l.id',
    [id],
    (error, team) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get players in team',
        });
      }

      const characterArr = [
        captain.id,
        brawlerA.id,
        brawlerB.id,
        bsBrawler.id,
        bsSupport.id,
        support.id,
        villain.id,
        battlefield.id,
        benchA.id,
        benchB.id,
        benchC.id,
        benchD.id,
        benchE.id,
      ];
      const characterIds = characterArr.filter((item) => !!item);

      mysql.query(
        'SELECT * FROM players WHERE id in (?)',
        [characterIds],
        (error, players) => {
          if (error) {
            return res.status(500).json({
              ...error,
              action: 'get players in team',
            });
          }

          let totalPoints = 0;
          const defaultPoints = 9000;
          players.forEach((item) => {
            totalPoints += item.power_level;
          });
          const userPoints = defaultPoints - totalPoints;

          if (userPoints < 0) {
            return res.status(404).json({
              message:
                'The Scouter says your power level is OVER 9000! Please readjust your roster',
            });
          }

          let teamPoints = 0;

          players.forEach((item) => {
            const affinities = affinitiesTypes(item);
            const isBattlefield = item.id === battlefield.id;
            const isBsSupport = item.id === bsSupport.id;
            const specificSupport =
              item.id === bsBrawler.id ? bsSupport.id : support.id;

            const boost = getBoostPoints(
              isBattlefield,
              isBsSupport,
              specificSupport,
              battlefield.id,
              affinities,
              item.power_level,
              team[0].week,
              players
            );

            teamPoints += item.power_level + boost.total;
          });

          mysql.query(
            'UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, bench_a = ?, bench_b = ?, bench_c = ?, bench_d = ?, bench_e = ?, points = ? WHERE id = ?',
            [
              captain.id,
              brawlerA.id,
              brawlerB.id,
              bsBrawler.id,
              bsSupport.id,
              support.id,
              villain.id,
              battlefield.id,
              benchA.id,
              benchB.id,
              benchC.id,
              benchD.id,
              benchE.id,
              teamPoints,
              id,
            ],
            (error) => {
              if (error) {
                return res.status(500).json({
                  ...error,
                  action: 'update team',
                });
              }

              mysql.query(
                'UPDATE league_members SET points = ? WHERE id = ?',
                [userPoints, team[0].league_member_id],
                (error) => {
                  if (error) {
                    return res.status(500).json({
                      ...error,
                      action: 'update team',
                    });
                  }

                  return res.status(200).json({
                    success: true,
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
