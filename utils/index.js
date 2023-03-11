/* eslint-disable no-useless-escape */
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');

module.exports.formatDate = () => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  return formattedDate;
};

module.exports.validateEmail = (email) => {
  if (!email.length) {
    return false;
  }

  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

module.exports.getAuthToken = (auth) => {
  if (!auth) {
    return null;
  }

  return auth.split(' ')[1];
};

module.exports.authenticateToken = (req, res, next) => {
  const token =
    req.cookies.token || this.getAuthToken(req.headers.authorization);

  if (!token) return res.status(401).json({ type: 'NO AUTH TOKEN!' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ type: 'BAD AUTH TOKEN' });
    req.user = user;
    next();
  });
};

module.exports.getAffinitiesTypes = (character) => {
  if (!character) {
    return [];
  }

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
    if (item.value > 0) {
      return item;
    }
  });
};

const season = [
  {
    element: 'fire',
    value: 250,
  },
  {
    element: 'water',
    value: 300,
  },
  {
    element: 'earth',
    value: 300,
  },
  {
    element: 'wind',
    value: 250,
  },
  {
    element: 'arcane',
    value: 200,
  },
  {
    element: 'darkness',
    value: 250,
  },
  {
    element: 'celestial',
    value: 300,
  },
  {
    element: 'ice',
    value: 300,
  },
  {
    element: 'electric',
    value: 250,
  },
  {
    element: 'noAffinity',
    value: 500,
  },
];

module.exports.randomAffinity = [
  'fire',
  'water',
  'earth',
  'wind',
  'arcane',
  'darkness',
  'celestial',
  'ice',
  'electric',
  'no_affinity',
  'wind, water',
  'darkness, ice',
  'arcane, fire',
];

const getWeeklyBoost = (affinities, teamAffinity, isAffinityActive) => {
  if (isAffinityActive === 0) {
    return 0;
  }

  const affinity = teamAffinity.split(',');

  const weekAffinity = [];
  let affinityVal = 0;

  affinity.forEach((item) => {
    const powerType = item === 'no_affinity' ? 'noAffinity' : item;
    const hasPower = affinities.filter((power) => power.type === powerType)[0];

    if (hasPower) {
      weekAffinity.push(hasPower.type);
    }
  });

  season.forEach((item) => {
    const hasPower = weekAffinity.some((affinity) => affinity === item.element);

    affinityVal += hasPower ? item.value : 0;
  });

  return affinityVal > 0 ? affinityVal / 100 : 0;
};

const getWeeklyDamage = (weakness, teamAffinity, isAffinityActive) => {
  if (weakness === 'None' || isAffinityActive === 0) {
    return 0;
  }

  const affinity = teamAffinity.split(',');

  const weekAffinity = [];
  let affinityVal = 0;

  affinity.forEach((item) => {
    const hasDamage = weakness.toLowerCase() === item;

    if (hasDamage) {
      weekAffinity.push(item);
    }
  });

  season.forEach((item) => {
    const hasDamage = weekAffinity.some(
      (affinity) => affinity === item.element
    );

    affinityVal += hasDamage ? item.value : 0;
  });

  return affinityVal > 0 ? affinityVal / 100 : 0;
};

const getSupportBoost = (players, mainAffinities, support) => {
  const character = players.filter((item) => item.id === support)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = affinities.filter((item) => {
    return mainAffinities.some((res) => res.type === item.type);
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
  const character = players.filter((item) => item.id === villain)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = affinities.filter((item) => {
    if (item.type === 'noAffinity') {
      return item;
    }

    return item.type === weakness.toLowerCase();
  });

  return hasMatch.length ? hasMatch[0].value / 100 : 0;
};

const getBattlefieldBoost = (players, mainAffinities, field) => {
  const character = players.filter((item) => item.id === field)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = affinities.filter((item) => {
    return mainAffinities.some((res) => res.type === item.type);
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
  const character = players.filter((item) => item.id === field)[0];
  const affinities = this.getAffinitiesTypes(character);
  const hasMatch = affinities.filter((item) => {
    if (item.type === 'noAffinity') {
      return item;
    }

    return item.type === weakness.toLowerCase();
  });
  let matchPoints = 0;

  if (hasMatch.length) {
    hasMatch.forEach((item) => {
      matchPoints += item.value / 100;
    });
  }

  return matchPoints;
};

const getVotingBoost = (votes, character) => {
  const { category, id } = character;
  const defaultBoost = 250;
  let voteBoost = defaultBoost / 100;
  let isWinner = null;

  if (!votes) {
    return 0;
  }

  votes.forEach((vote) => {
    const isPlayerA =
      vote.player_a_id === id &&
      vote.rank.toLowerCase() === category.toLowerCase();
    const isPlayerB =
      vote.player_b_id === id &&
      vote.rank.toLowerCase() === category.toLowerCase();

    if (isPlayerA) {
      isWinner = vote.player_a_count > vote.player_b_count;
    }

    if (isPlayerB) {
      isWinner = vote.player_b_count > vote.player_a_count;
    }
  });

  return isWinner ? voteBoost : 0;
};

const getVotingDamage = (votes, character) => {
  const { category, id } = character;
  const defaultDamage = 150;
  let voteDamage = defaultDamage / 100;
  let isLoser = null;

  if (!votes) {
    return 0;
  }

  votes.forEach((vote) => {
    const isPlayerA =
      vote.player_a_id === id &&
      vote.rank.toLowerCase() === category.toLowerCase();
    const isPlayerB =
      vote.player_b_id === id &&
      vote.rank.toLowerCase() === category.toLowerCase();

    if (isPlayerA) {
      isLoser = vote.player_a_count < vote.player_b_count;
    }

    if (isPlayerB) {
      isLoser = vote.player_b_count < vote.player_a_count;
    }
  });

  return isLoser ? voteDamage : 0;
};

module.exports.getBoostPoints = (
  isBattlefield,
  isSupportInvalid,
  specificSupport,
  battlefield,
  affinities,
  players,
  votes,
  character,
  teamAffinity,
  isAffinityActive
) => {
  const { power_level } = character;
  const weekBoost =
    getWeeklyBoost(affinities, teamAffinity, isAffinityActive) * power_level;
  const boostSupport =
    getSupportBoost(players, affinities, specificSupport) * power_level;
  const battlefieldSupport =
    getBattlefieldBoost(players, affinities, battlefield) * power_level;
  const votingBoost = getVotingBoost(votes, character) * power_level;

  const supportPoints = isSupportInvalid ? 0 : Math.floor(boostSupport);
  const fieldPoints = isBattlefield ? 0 : Math.floor(battlefieldSupport);
  const weekPoints = Math.floor(weekBoost);
  const votingPoints = Math.floor(votingBoost);
  const totalPoints = supportPoints + fieldPoints + weekPoints + votingPoints;

  return {
    week: weekPoints,
    support: supportPoints,
    battlefield: fieldPoints,
    voting: votingPoints,
    total: totalPoints,
  };
};

module.exports.getDamagePoints = (
  villain,
  battlefield,
  weakness,
  players,
  votes,
  character,
  teamAffinity,
  isAffinityActive
) => {
  const { power_level } = character;
  const weekDamage = getWeeklyDamage(weakness, teamAffinity, isAffinityActive);
  const villainDamage = getVillainDamage(players, weakness, villain);
  const battlefieldDamage = getBattlefieldDamage(
    players,
    weakness,
    battlefield
  );
  const votingDamage = getVotingDamage(votes, character);

  const villainPoints =
    villainDamage === 0 ? 0 : Math.floor(power_level / villainDamage);
  const fieldPoints =
    battlefieldDamage === 0 ? 0 : Math.floor(power_level / battlefieldDamage);
  const weekPoints =
    weekDamage === 0 ? 0 : Math.floor(power_level / weekDamage);
  const votingPoints =
    votingDamage === 0 ? 0 : Math.floor(power_level / votingDamage);
  const totalPoints = villainPoints + fieldPoints + weekPoints + votingPoints;

  return {
    week: weekPoints,
    villain: villainPoints,
    battlefield: fieldPoints,
    voting: votingPoints,
    total: totalPoints,
  };
};

module.exports.characterAttr = (players, char, rank, details) => {
  const main = players.filter((item) => item.id === char);
  const {
    support,
    battlefield,
    bs_support,
    opponentVillain,
    opponentBattlefield,
    votes,
    affinity,
    activeAffinity,
  } = details;

  if (!main.length) {
    return {
      id: null,
      name: null,
      teamPoints: null,
      matchPoints: null,
      affinity: null,
      originalPower: null,
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
    players,
    votes,
    main[0],
    affinity,
    activeAffinity
  );

  const damage = this.getDamagePoints(
    opponentVillain,
    opponentBattlefield,
    weakness,
    players,
    votes,
    main[0],
    affinity,
    activeAffinity
  );

  const teamPoints = power_level + boost.total;
  const matchPoints = teamPoints - damage.total;

  return {
    id,
    name,
    rank,
    teamPoints,
    matchPoints,
    affinity: affinities,
    originalPower: power_level,
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

module.exports.sortRankings = (arr) => {
  return arr.sort((a, b) => {
    return a.win > b.win ? -1 : a.win < b.win ? 1 : 0;
  });
};

const filterPlayer = (arr, target) => {
  if (/#|Bye/.test(target)) {
    return target;
  }

  return arr.filter((item) => item.id === target)[0].name;
};

module.exports.bracketMatchup = (allPlayers, data, match) => {
  const { p1, p2, score1, score2, hasEnded, round, voteId } = data;

  return {
    homeTeamName: filterPlayer(allPlayers, p1),
    awayTeamName: filterPlayer(allPlayers, p2),
    round,
    matchNumber: match,
    homeTeamScore: score1,
    awayTeamScore: score2,
    matchAccepted: hasEnded,
    matchComplete: true,
    homeTeamId: p1,
    awayTeamId: p2,
    voteId,
  };
};

module.exports.filterBracketVotingStatus = (voting, game) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  return vote ? vote?.active === 0 : false;
};

module.exports.filterBracketVotingScores = (voting, game, player) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  return vote ? vote[player] : 0;
};

module.exports.filterBracketVotingWinner = (voting, game, match) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  if (vote) {
    if (vote.active !== 0) {
      return `#${match} Winner`;
    }

    return vote.player_a_count < vote.player_b_count
      ? vote.player_b_id
      : vote.player_a_id;
  }

  return `#${match} Winner`;
};

module.exports.filterBracketVotingId = (voting, game) => {
  const vote = voting.length && voting.filter((vote) => vote.rank === game)[0];

  return vote ? vote.id : null;
};
