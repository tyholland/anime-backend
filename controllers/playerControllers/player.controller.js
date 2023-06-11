const mysql = require('../../utils/mysql').instance();
const malScraper = require('mal-scraper');

module.exports.getAllPlayers = async (req, res) => {
  try {
    const players = await mysql('SELECT * FROM players WHERE active = ?', [1]);

    return res.status(200).json(players);
  } catch (error) {
    res.status(500).json({
      error,
      action: 'Get all players',
    });
  }
};

module.exports.getAdminPlayers = async (req, res) => {
  try {
    const players = await mysql('SELECT * FROM players');

    return res.status(200).json(players);
  } catch (error) {
    res.status(500).json({
      error,
      action: 'Get all admin players',
    });
  }
};

module.exports.getPlayer = async (req, res) => {
  const { player_id } = req.params;

  try {
    const player = await mysql(
      'SELECT * FROM players WHERE id = ? AND active = ?',
      [player_id, 1]
    );

    return res.status(200).json(player);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get specific player',
    });
  }
};

module.exports.getPlayablePlayers = async (req, res) => {
  const { team_id } = req.params;

  try {
    const players = await mysql('SELECT * FROM players WHERE active = ?', [1]);
    const league = await mysql(
      'SELECT l.id FROM league l, league_members lm, team t WHERE t.id = ? AND t.league_member_id = lm.id AND lm.league_id = l.id',
      [team_id]
    );
    const playerList = await mysql(
      'SELECT t.captain, t.brawler_a, t.brawler_b, t.bs_brawler, t.bs_support, t.support, t.villain, t.battlefield FROM league l, league_members lm, team t WHERE l.id = ? AND lm.league_id = l.id AND t.league_member_id = lm.id AND t.week = l.week',
      [league[0].id]
    );

    const unusedPlayers = players?.filter((player) => {
      if (
        Object.values(playerList).some(
          (list) =>
            list.captain === player.id ||
            list.brawler_a === player.id ||
            list.brawler_b === player.id ||
            list.bs_brawler === player.id ||
            list.bs_support === player.id ||
            list.support === player.id ||
            list.villain === player.id ||
            list.battlefield === player.id
        )
      ) {
        return;
      }

      return player;
    });

    return res.status(200).json({
      unusedPlayers,
      allPlayers: players,
    });
  } catch (error) {
    res.status(500).json({
      error,
      action: 'Get all playable players',
    });
  }
};

module.exports.getAnimeNews = async (req, res) => {
  const search = malScraper.search;

  try {
    const listings = await search.search('anime', {
      term: 'shounen',
      maxResults: 100,
    });

    return res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get anime news',
    });
  }
};

module.exports.updatePlayer = async (req, res) => {
  const {
    full_name,
    name,
    series,
    power_level,
    category,
    fire,
    water,
    wind,
    earth,
    arcane,
    electric,
    celestial,
    darkness,
    ice,
    no_affinity,
    weakness,
    image_url,
    active,
    id,
  } = req.body;

  try {
    await mysql(
      'UPDATE players SET full_name = ?, name = ?, series = ?, power_level = ?, category = ?, fire = ?, water = ?, wind = ?, earth = ?, arcane = ?, electric = ?, celestial = ?, darkness = ?, ice = ?, no_affinity = ?, weakness = ?, image_url = ?, active = ? WHERE id = ?',
      [
        full_name,
        name,
        series,
        parseInt(power_level),
        category,
        parseInt(fire),
        parseInt(water),
        parseInt(wind),
        parseInt(earth),
        parseInt(arcane),
        parseInt(electric),
        parseInt(celestial),
        parseInt(darkness),
        parseInt(ice),
        parseInt(no_affinity),
        weakness,
        image_url,
        parseInt(active),
        id,
      ]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Update Player',
    });
  }
};

module.exports.addPlayer = async (req, res) => {
  const { player, series, rank } = req.body;

  try {
    await mysql(
      'INSERT INTO `players` (`full_name`, `name`, `series`, `power_level`, `category` ) VALUES (?, ?, ?, ?, ?)',
      [player, player, series, 0, rank]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Add Player',
    });
  }
};
