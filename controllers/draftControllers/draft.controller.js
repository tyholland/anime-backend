const mysql = require('../../utils/mysql').instance();

module.exports.getDraft = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    const teams = await mysql(
      'SELECT * FROM league_members WHERE league_id = ?',
      [league_id]
    );

    const currentTeam = teams.filter((item) => {
      return item.user_id === userId;
    })[0];

    const specificTeam = await mysql(
      'SELECT * FROM team WHERE league_member_id = ? AND week = ?',
      [currentTeam.id, -1]
    );

    const characterArr = [
      specificTeam[0].captain,
      specificTeam[0].brawlerA,
      specificTeam[0].brawlerB,
      specificTeam[0].bsBrawler,
      specificTeam[0].bsSupport,
      specificTeam[0].support,
      specificTeam[0].villain,
      specificTeam[0].battlefield,
    ];

    const characterIds = characterArr.filter((item) => !!item);
    const emptyTeam = {
      captain: null,
      brawler_a: null,
      brawler_b: null,
      bs_brawler: null,
      bs_support: null,
      support: null,
      villain: null,
      battlefield: null,
      teamId: specificTeam[0].id,
    };

    const players = characterIds.length
      ? await mysql('SELECT * FROM players WHERE id in (?)', [characterIds])
      : [];

    if (players.length === 0) {
      return res.status(200).json({ teams, userTeam: emptyTeam });
    }

    const userTeam = {
      captain: players.filter((item) => item.id === specificTeam[0].captain),
      brawler_a: players.filter((item) => item.id === specificTeam[0].brawlerA),
      brawler_b: players.filter((item) => item.id === specificTeam[0].brawlerB),
      bs_brawler: players.filter(
        (item) => item.id === specificTeam[0].bsBrawler
      ),
      bs_support: players.filter(
        (item) => item.id === specificTeam[0].bsSupport
      ),
      support: players.filter((item) => item.id === specificTeam[0].support),
      villain: players.filter((item) => item.id === specificTeam[0].villain),
      battlefield: players.filter(
        (item) => item.id === specificTeam[0].battlefield
      ),
      teamId: specificTeam[0].id,
    };

    return res.status(200).json({ teams, userTeam });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Bracket - get the champ',
    });
  }
};
