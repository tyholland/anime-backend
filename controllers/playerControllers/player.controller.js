﻿const mysql = require('../../utils/mysql').instance();

module.exports.getAllPlayers = async (req, res) => {
  try {
    const players = await mysql('SELECT * FROM players');

    return res.status(200).json(players);
  } catch (error) {
    res.status(500).json({
      ...error,
      action: 'Get all players',
    });
  }
};

module.exports.getPlayer = async (req, res) => {
  const { player_id } = req.params;

  try {
    const player = await mysql('SELECT * FROM players WHERE id = ?', [
      player_id,
    ]);

    return res.status(200).json(player);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get specific player',
    });
  }
};
