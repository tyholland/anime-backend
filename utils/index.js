/* eslint-disable no-useless-escape */
const secret = process.env.REACT_APP_SECRET;
const jwt = require('jsonwebtoken');
const mysql = require('./mysql').instance();

module.exports.formatDate = () => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  return formattedDate;
};

module.exports.authenticateToken = (req, res, next) => {
  // only does email I think
  const token = req.cookies.token; //bearer token
  if (token == null) return res.status(401).json({ type: 'NO AUTH TOKEN!' });
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ type: 'BAD AUTH TOKEN' });
    req.user = user;
    next();
  });
};

module.exports.createNewTeam = (userId, leagueId, res) => {
  mysql.query(
    'SELECT email FROM users WHERE id = ?',
    [userId],
    (error, user) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get user email',
        });
      }

      const defaultTeam = `Team ${user[0].email.split('@')[0]}`;
      const defaultPoints = 9000;

      mysql.query(
        'INSERT INTO `league_members` (`user_id`, `league_id`, `team_name`, `points`) VALUES (?, ?, ?, ?)',
        [userId, leagueId, defaultTeam, defaultPoints],
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

              return res.status(200).json({
                teamId: team.insertId,
                leagueId,
              });
            }
          );
        }
      );
    }
  );
};

module.exports.affinitiesTypes = (character) => {
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

const season = [
  {
    week: 1,
    element: 'fire',
    value: 250,
  },
  {
    week: 2,
    element: 'water',
    value: 300,
  },
  {
    week: 3,
    element: 'earth',
    value: 300,
  },
  {
    week: 4,
    element: 'wind',
    value: 250,
  },
  {
    week: 5,
    element: 'arcane',
    value: 200,
  },
  {
    week: 6,
    element: 'darkness',
    value: 250,
  },
  {
    week: 7,
    element: 'celestial',
    value: 300,
  },
  {
    week: 8,
    element: 'ice',
    value: 300,
  },
  {
    week: 9,
    element: 'electric',
    value: 250,
  },
  {
    week: 10,
    element: ['wind', 'water'],
    value: [250, 300],
  },
  {
    week: 11,
    element: ['darkness', 'ice'],
    value: [250, 300],
  },
  {
    week: 12,
    element: ['arcane', 'fire'],
    value: [200, 250],
  },
];

const weeklyBoost = (affinities, week) => {
  const weekAffinity = season.filter((item) => {
    return (
      item.week === week &&
      affinities.some((power) => power.type === item.element)
    );
  });

  return weekAffinity.length ? weekAffinity[0].value / 100 : 0;
};

const weeklyDamage = (weakness, week) => {
  const damage = season.filter((item) => {
    return item.week === week && weakness === item.element;
  });

  return damage.length ? damage[0].value / 100 : 0;
};

const supportBoost = (players, mainAffinities, support) => {
  const character = players.filter((item) => item.id === support)[0];
  const affinities = this.affinitiesTypes(character);
  const hasMatch = mainAffinities.filter((item) => {
    return affinities.some((res) => res.type === item.type);
  });

  return hasMatch.length ? hasMatch[0].value / 100 : 0;
};

const battlefieldBoost = (players, mainAffinities, field) => {
  const character = players.filter((item) => item.id === field)[0];
  const affinities = this.affinitiesTypes(character);
  const hasMatch = mainAffinities.filter((item) => {
    return affinities.some((res) => res.type === item.type);
  });

  return hasMatch.length ? hasMatch[0].value / 100 : 0;
};

// const villainDamage = (players, mainAffinities, villain) => {
//   const character = players.filter((item) => item.id === villain)[0];
//   const affinities = this.affinitiesTypes(character);
//   const hasMatch = mainAffinities.filter((item) => {
//     return affinities.some((res) => res.type === item.type);
//   });

//   return hasMatch.length ? hasMatch[0].value / 100 : 0;
// };

module.exports.getBoostPoints = (
  isBattlefield,
  isBsSupport,
  specificSupport,
  battlefield,
  affinities,
  powerLevel,
  week,
  players
) => {
  const weekBoost = weeklyBoost(affinities, week) * powerLevel;
  const boostSupport =
    supportBoost(players, affinities, specificSupport) * powerLevel;
  const battlefieldSupport =
    battlefieldBoost(players, affinities, battlefield) * powerLevel;

  const supportPoints =
    isBattlefield || isBsSupport ? 0 : Math.floor(boostSupport);
  const fieldPoints = isBattlefield ? 0 : Math.floor(battlefieldSupport);
  const weekPoints = Math.floor(weekBoost);
  const totalPoints = supportPoints + fieldPoints + weekPoints;

  return {
    week: weekPoints,
    support: supportPoints,
    battlefield: fieldPoints,
    voting: 0,
    total: totalPoints,
  };
};

const characterAttr = (players, char, rank, details) => {
  const main = players.filter((item) => item.id === char);
  const { week, support, battlefield, bs_support } = details;

  if (!main.length) {
    return {
      id: null,
      name: null,
      points: null,
      affinity: null,
      boost: {
        week: null,
        support: null,
        battlefield: null,
        voting: null,
      },
      damage: {
        week: null,
        villain: null,
        battlefield: null,
        voting: null,
      },
    };
  }

  const { id, name, power_level, weakness } = main[0];

  const isBattlefield = rank === 'battlefield';
  const isBsBrawler = rank === 'bs_brawler';
  const isBsSupport = rank === 'bs_support';
  const affinities = this.affinitiesTypes(main[0]);
  const damage = weeklyDamage(weakness, week) !== 0;
  const weekDamage = damage ? power_level / weeklyDamage(weakness, week) : 0;
  const specificSupport = isBsBrawler ? bs_support : support;

  const boost = this.getBoostPoints(
    isBattlefield,
    isBsSupport,
    specificSupport,
    battlefield,
    affinities,
    power_level,
    week,
    players
  );

  const characterPoints = power_level + boost.total;

  return {
    id: id,
    name: name,
    points: characterPoints,
    affinity: affinities,
    boost: {
      week: boost.week,
      support: boost.support,
      battlefield: boost.battlefield,
      voting: boost.voting,
    },
    damage: {
      week: Math.floor(weekDamage),
      villain: 0,
      battlefield: 0,
      voting: null,
    },
  };
};

module.exports.formatTeam = (data, member, res) => {
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

      const details = {
        week,
        support,
        bs_support,
        battlefield,
        villain,
      };

      return res.status(200).json({
        teamName: member.team_name,
        leagueName: member.name,
        userPoints: member.userPoints,
        team: {
          captain: characterAttr(players, captain, 'captain', details),
          brawler_a: characterAttr(players, brawler_a, 'brawler_a', details),
          brawler_b: characterAttr(players, brawler_b, 'brawler_b', details),
          bs_brawler: characterAttr(players, bs_brawler, 'bs_brawler', details),
          bs_support: characterAttr(players, bs_support, 'bs_support', details),
          support: characterAttr(players, support, 'support', details),
          villain: characterAttr(players, villain, 'villain', details),
          battlefield: characterAttr(
            players,
            battlefield,
            'battlefield',
            details
          ),
          bench_a: characterAttr(players, bench_a, 'bench_a', details),
          bench_b: characterAttr(players, bench_b, 'bench_b', details),
          bench_c: characterAttr(players, bench_c, 'bench_c', details),
          bench_d: characterAttr(players, bench_d, 'bench_d', details),
          bench_e: characterAttr(players, bench_e, 'bench_e', details),
          week,
          points,
        },
      });
    }
  );
};
