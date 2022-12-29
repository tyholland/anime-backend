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
      type: 'Fire',
      value: fire,
    },
    {
      type: 'Water',
      value: water,
    },
    {
      type: 'Wind',
      value: wind,
    },
    {
      type: 'Earth',
      value: earth,
    },
    {
      type: 'Arcane',
      value: arcane,
    },
    {
      type: 'Electric',
      value: electric,
    },
    {
      type: 'Celestrial',
      value: celestrial,
    },
    {
      type: 'Darkness',
      value: darkness,
    },
    {
      type: 'Ice',
      value: ice,
    },
    {
      type: 'No Affinity',
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
    id: char[0].id,
    name: char[0].name,
    points: char[0].power_level,
    affinity: affinitiesTypes(char[0]),
  };
};

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
    (error, players) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get players in team',
        });
      }

      return {
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
    'UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, bench_a = ?, bench_b = ?, bench_c = ?, bench_d = ?, bench_e = ?, week = ?, points = ? WHERE league_member_id = ? and week = ?',
    [
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
