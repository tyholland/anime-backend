const mysql = require('../../utils/mysql').instance();

const affinitiesTypes = (character) => {
  const {
    fire,
    water,
    wind,
    earth,
    arcane,
    electric,
    celestrial,
    darkness,
    ice,
    no_affinity,
  } = character;
  const affinities = [
    {
      type: 'fire',
      value: fire,
    },
    {
      type: 'water',
      value: water,
    },
    {
      type: 'wind',
      value: wind,
    },
    {
      type: 'earth',
      value: earth,
    },
    {
      type: 'arcane',
      value: arcane,
    },
    {
      type: 'electric',
      value: electric,
    },
    {
      type: 'celestrial',
      value: celestrial,
    },
    {
      type: 'darkness',
      value: darkness,
    },
    {
      type: 'ice',
      value: ice,
    },
    {
      type: 'noAffinity',
      value: no_affinity,
    },
  ];

  return affinities.filter((item) => {
    if (!!item.value && item.value > 0) {
      return item;
    }
  });
};

const characterAttr = (players, char) => {
  const main = players.filter((item) => item.id === char);

  if (!main.length) {
    return {
      id: null,
      name: null,
      points: null,
      affinity: null,
    };
  }

  return {
    id: main[0].id,
    name: main[0].name,
    points: main[0].power_level,
    affinity: affinitiesTypes(main[0]),
  };
};

const formatTeam = (data, member, res) => {
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
  const characterArr = [
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
  ];
  const characterIds = characterArr.filter((item) => !!item);

  if (!characterIds.length) {
    return res.status(200).json({
      teamName: member.team_name,
      leagueName: member.name,
      userPoints: member.userPoints,
      team: {
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
      },
    });
  }

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

      return res.status(200).json({
        teamName: member.team_name,
        leagueName: member.name,
        userPoints: member.userPoints,
        team: {
          captain: characterAttr(players, captain),
          brawler_a: characterAttr(players, brawler_a),
          brawler_b: characterAttr(players, brawler_b),
          bs_brawler: characterAttr(players, bs_brawler),
          bs_support: characterAttr(players, bs_support),
          support: characterAttr(players, support),
          villain: characterAttr(players, villain),
          battlefield: characterAttr(players, battlefield),
          bench_a: characterAttr(players, bench_a),
          bench_b: characterAttr(players, bench_b),
          bench_c: characterAttr(players, bench_c),
          bench_d: characterAttr(players, bench_d),
          bench_e: characterAttr(players, bench_e),
          week,
          points,
        },
      });
    }
  );
};

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
    week,
    points,
  } = req.body;

  mysql.query(
    'SELECT league_member_id FROM team WHERE id = ?',
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

          mysql.query(
            'UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, bench_a = ?, bench_b = ?, bench_c = ?, bench_d = ?, bench_e = ?, points = ? WHERE id = ? AND week = ?',
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
              parseInt(points),
              id,
              week,
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
