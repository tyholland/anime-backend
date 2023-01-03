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
    'SELECT u.email, l.week FROM users u, league l WHERE u.id = ? AND l.id = ?',
    [userId, leagueId],
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
            [members.insertId, user[0].week],
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

module.exports.getAffinitiesTypes = (character) => {
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

const getWeeklyBoost = (affinities, week) => {
  const weekAffinity = season.filter((item) => {
    return (
      item.week === week &&
      affinities.some((power) => power.type === item.element)
    );
  });

  return weekAffinity.length ? weekAffinity[0].value / 100 : 0;
};

const getWeeklyDamage = (weakness, week) => {
  if (!weakness || weakness === 'None') {
    return 0;
  }

  const damage = season.filter((item) => {
    return item.week === week && weakness.toLowerCase() === item.element;
  });

  return damage.length ? damage[0].value / 100 : 0;
};

const getSupportBoost = (players, mainAffinities, support) => {
  const character = players.filter((item) => item.id === support)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = mainAffinities.filter((item) => {
    return affinities.some((res) => res.type === item.type);
  });
  let matchPoints = 0;

  if (hasMatch.length) {
    hasMatch.forEach((item) => {
      matchPoints += item.value / 100;
    });
  }

  return matchPoints;
};

const getVillainDamage = (players, weakness, villain) => {
  if (!weakness || weakness === 'None') {
    return 0;
  }

  const character = players.filter((item) => item.id === villain)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = affinities.filter((item) => {
    return item.type === weakness.toLowerCase();
  });

  return hasMatch.length ? hasMatch[0].value / 100 : 0;
};

const getBattlefieldBoost = (players, mainAffinities, field) => {
  const character = players.filter((item) => item.id === field)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = mainAffinities.filter((item) => {
    return affinities.some((res) => res.type === item.type);
  });
  let matchPoints = 0;

  if (hasMatch.length) {
    hasMatch.forEach((item) => {
      matchPoints += item.value / 100;
    });
  }

  return matchPoints;
};

const getBattlefieldDamage = (players, weakness, field) => {
  if (!weakness || weakness === 'None') {
    return 0;
  }

  const character = players.filter((item) => item.id === field)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = affinities.filter((item) => {
    return item.type === weakness.toLowerCase();
  });

  return hasMatch.length ? hasMatch[0].value / 100 : 0;
};

module.exports.getBoostPoints = (
  isBattlefield,
  isSupportInvalid,
  specificSupport,
  battlefield,
  affinities,
  powerLevel,
  week,
  players
) => {
  const weekBoost = getWeeklyBoost(affinities, week) * powerLevel;
  const boostSupport =
    getSupportBoost(players, affinities, specificSupport) * powerLevel;
  const battlefieldSupport =
    getBattlefieldBoost(players, affinities, battlefield) * powerLevel;

  const supportPoints = isSupportInvalid ? 0 : Math.floor(boostSupport);
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

module.exports.getDamagePoints = (
  villain,
  battlefield,
  powerLevel,
  weakness,
  week,
  players
) => {
  const weekDamage = getWeeklyDamage(weakness, week) * powerLevel;
  const villainDamage =
    getVillainDamage(players, weakness, villain) * powerLevel;
  const battlefieldDamage =
    getBattlefieldDamage(players, weakness, battlefield) * powerLevel;

  const villainPoints = Math.floor(villainDamage);
  const fieldPoints = Math.floor(battlefieldDamage);
  const weekPoints = Math.floor(weekDamage);
  const totalPoints = villainPoints + fieldPoints + weekPoints;

  return {
    week: weekPoints,
    villain: villainPoints,
    battlefield: fieldPoints,
    voting: 0,
    total: totalPoints,
  };
};

const characterAttr = (players, char, rank, details) => {
  const main = players.filter((item) => item.id === char);
  const {
    week,
    support,
    battlefield,
    bs_support,
    opponentVillain,
    opponentBattlefield,
  } = details;

  if (!main.length) {
    return {
      id: null,
      name: null,
      teamPoints: null,
      matchPoints: null,
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
  const isSupport = rank === 'support';
  const affinities = this.getAffinitiesTypes(main[0]);
  const specificSupport = isBsBrawler ? bs_support : support;
  const isSupportInvalid = isSupport || isBsSupport || isBattlefield;

  const boost = this.getBoostPoints(
    isBattlefield,
    isSupportInvalid,
    specificSupport,
    battlefield,
    affinities,
    power_level,
    week,
    players
  );

  const damage = this.getDamagePoints(
    opponentVillain,
    opponentBattlefield,
    power_level,
    weakness,
    week,
    players
  );

  const teamPoints = power_level + boost.total;
  const matchPoints = teamPoints - damage.total;

  return {
    id,
    name,
    teamPoints,
    matchPoints,
    affinity: affinities,
    boost: {
      week: boost.week,
      support: boost.support,
      battlefield: boost.battlefield,
      voting: boost.voting,
    },
    damage: {
      week: damage.week,
      villain: damage.villain,
      battlefield: damage.battlefield,
      voting: damage.voting,
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
    week,
    points,
    id,
    status,
  } = data;

  const homeTeam = status === 'home' ? 'team_a' : 'team_b';
  const awayTeam = status === 'away' ? 'team_a' : 'team_b';

  mysql.query(
    `SELECT t.villain, t.battlefield FROM matchup m, team t WHERE m.league_id = ? AND m.week = ? AND m.${homeTeam} = ? AND t.id = m.${awayTeam}`,
    [member.league_id, week, id],
    (error, matchup) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get week matchup',
        });
      }

      const characterArr = [
        captain,
        brawler_a,
        brawler_b,
        bs_brawler,
        bs_support,
        support,
        villain,
        battlefield,
        matchup[0].villain,
        matchup[0].battlefield,
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
            opponentVillain: matchup[0].villain,
            opponentBattlefield: matchup[0].battlefield,
          };

          return res.status(200).json({
            teamName: member.team_name,
            leagueName: member.name,
            userPoints: member.userPoints,
            team: {
              captain: characterAttr(players, captain, 'captain', details),
              brawler_a: characterAttr(
                players,
                brawler_a,
                'brawler_a',
                details
              ),
              brawler_b: characterAttr(
                players,
                brawler_b,
                'brawler_b',
                details
              ),
              bs_brawler: characterAttr(
                players,
                bs_brawler,
                'bs_brawler',
                details
              ),
              bs_support: characterAttr(
                players,
                bs_support,
                'bs_support',
                details
              ),
              support: characterAttr(players, support, 'support', details),
              villain: characterAttr(players, villain, 'villain', details),
              battlefield: characterAttr(
                players,
                battlefield,
                'battlefield',
                details
              ),
              week,
              points,
            },
          });
        }
      );
    }
  );
};
