const mysql = require('../../utils/mysql').instance();
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../../utils');
const secret = process.env.SECRET;
const { addMemberToList } = require('../../utils/mailchimp');

module.exports.checkUserExists = async (req, res) => {
  const { firebaseId, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE firebase_uid = ? AND email = ?',
      [firebaseId, email]
    );

    return res.status(200).json({
      exists: !!account.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Check if User exists',
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const { firebaseId, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE firebase_uid = ? AND email = ?',
      [firebaseId, email]
    );

    if (!account.length) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const user = {
      email,
      userId: account[0].user_id,
      firebaseId,
    };
    const accessToken = jwt.sign(user, secret);

    return res.status(200).json({
      ...account[0],
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Login User',
    });
  }
};

module.exports.createUser = async (req, res) => {
  const { email, firebaseId } = req.body;
  const date = new Date().toISOString();

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const user = await mysql(
      'SELECT * FROM users WHERE email = ? AND active = ?',
      [email, 1]
    );

    if (user[0]?.email === email) {
      return res.status(400).json({
        message: 'User\'s email already exists',
      });
    }

    const oldUser = await mysql(
      'SELECT email, id as user_id FROM users WHERE email = ? AND active = ?',
      [email, 0]
    );

    if (oldUser.length) {
      await mysql(
        'UPDATE users SET firebase_uid = ?, active = ? WHERE id = ?',
        [firebaseId, 1, oldUser[0].user_id]
      );

      const accessObj = {
        email: oldUser[0].email,
        userId: oldUser[0].user_id,
        firebaseId,
      };
      const accessToken = jwt.sign(accessObj, secret);

      return res.status(200).json({
        ...oldUser[0],
        token: accessToken,
      });
    }

    const newUser = await mysql(
      'INSERT INTO `users` (`email`, `firebase_uid`, `create_date`) VALUES (?, ?, ?)',
      [email, firebaseId, date]
    );

    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE id = ?',
      [newUser.insertId]
    );

    await addMemberToList(account[0].email);

    const accessObj = {
      email: account[0].email,
      userId: account[0].user_id,
      firebaseId,
    };
    const accessToken = jwt.sign(accessObj, secret);

    return res.status(200).json({
      ...account[0],
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Create User',
    });
  }
};

module.exports.deleteAccount = async (req, res) => {
  const { userId } = req.user;

  try {
    const userLeagues = await mysql(
      'SELECT * FROM league_members lm, league l WHERE lm.user_id = ? AND lm.league_id = l.id AND l.active = ?',
      [userId, 1]
    );

    if (userLeagues.length) {
      return res.status(400).json({
        message: 'You can not delete an account that is in an active league',
      });
    }

    await mysql('UPDATE users SET active = ? WHERE id = ?', [0, userId]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Delete Account',
    });
  }
};

module.exports.logoutUser = (req, res) => {
  return res.clearCookie('__session').status(200).json({ success: true });
};

module.exports.adminDashboard = async (req, res) => {
  const { firebaseId } = req.user;

  try {
    const users = await mysql('SELECT * FROM admin');

    if (!users.some((item) => item.firebase_uid === firebaseId)) {
      return res.status(400).json({
        message: 'You are not authorizzed to view this page',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Admin Dashboard',
    });
  }
};

module.exports.playerFormula = async (req, res) => {
  const goat = 4000;
  const elite = 2000;
  const gradeA = 1500;
  const gradeB = 1000;
  const gradeC = 500;
  const captain = 1000;
  const brawler = 800;
  const support = 500;
  const battlefield = 200;
  const villain = 900;
  const { update } = req.params;

  try {
    /*****************
     * Captains
     * ***************/
    if (update === 'captain') {
      const goatCaptain = await mysql(
        'SELECT id FROM players WHERE series = \'DBZ\' AND category = \'Captain\''
      );

      goatCaptain.push({ id: 3 });

      for (let index = 0; index < goatCaptain.length; index++) {
        const { id } = goatCaptain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${goat} + ${captain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            goat / 2
          } + ${captain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const eliteCaptain = await mysql(
        'SELECT id FROM players WHERE series = \'One Punch Man\' OR series = \'One Piece\' OR series = \'Naruto\' OR series = \'My Hero Academia\' OR series = \'Bleach\' OR series = \'Jujutsu Kaisen\' OR series = \'Attack on Titan\' OR series = \'Fairy Tail\' OR series = \'Demon Slayer\' OR series = \'Hunter x Hunter\' AND category = \'Captain\''
      );

      for (let index = 0; index < eliteCaptain.length; index++) {
        const { id } = eliteCaptain[index];

        if (id !== 3) {
          await mysql(
            `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${elite} + ${captain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
              elite / 2
            } + ${captain / 2}) WHERE p1.id = ?`,
            [id, id]
          );
        }
      }

      const gradeACaptain = await mysql(
        'SELECT id FROM players WHERE series = \'Black Clover\' OR series = \'Solo Leveling\' OR series = \'The God of High School\' OR series = \'The Seven Deadly Sins\' OR series = \'Fire Force\' OR series = \'Yu Yu Hakusho\' OR series = \'TBATE\' OR series = \'Full Metal Alchemist\' OR series = \'Inuyasha\' OR series = \'Sailor Moon\' OR series = \'Rurouni Kenshin\' AND category = \'Captain\''
      );

      for (let index = 0; index < gradeACaptain.length; index++) {
        const { id } = gradeACaptain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeA} + ${captain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeA / 2
          } + ${captain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeBCaptain = await mysql(
        'SELECT id FROM players WHERE series = \'Latna Saga: Survival of…\' OR series = \'Soul Eater\' OR series = \'Tensei Slime\' OR series = \'The Great Mage Returns\' OR series = \'Omniscient Reader\' OR series = \'Death Note\' OR series = \'KonoSuba\' OR series = \'Gundam Wing\' OR series = \'Katekyo Hitman Reborn!\' OR series = \'Shield Hero\' OR series = \'Cowboy Bebop\' OR series = \'Trigun\' OR series = \'Magic Emperor\' OR series = \'Martial Arts Reigns\' OR series = \'Versatile Mage\' OR series = \'Unordinary\' OR series = \'Akira\' AND category = \'Captain\''
      );

      for (let index = 0; index < gradeBCaptain.length; index++) {
        const { id } = gradeBCaptain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeB} + ${captain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeB / 2
          } + ${captain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeCCaptain = await mysql(
        'SELECT id FROM players WHERE series = \'Blue Exorcist\' OR series = \'Magi\' OR series = \'Digimon\' OR series = \'Boondocks\' OR series = \'Dr. Stone\' OR series = \'Yu-Gi-Oh!\' OR series = \'Paranoia Agent\' OR series = \'No Series\' OR series = \'Berserk\' AND category = \'Captain\''
      );

      for (let index = 0; index < gradeCCaptain.length; index++) {
        const { id } = gradeCCaptain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeC} + ${captain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            goat / 2
          } + ${gradeC / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }
    }

    /*****************
     * Brawlers
     * ***************/
    if (update === 'brawler') {
      const goatBrawler = await mysql(
        'SELECT id FROM players WHERE series = \'DBZ\' AND category = \'Brawler\''
      );

      for (let index = 0; index < goatBrawler.length; index++) {
        const { id } = goatBrawler[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${goat} + ${brawler} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            goat / 2
          } + ${brawler / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const eliteBrawler = await mysql(
        'SELECT id FROM players WHERE series = \'One Punch Man\' OR series = \'One Piece\' OR series = \'Naruto\' OR series = \'My Hero Academia\' OR series = \'Bleach\' OR series = \'Jujutsu Kaisen\' OR series = \'Attack on Titan\' OR series = \'Fairy Tail\' OR series = \'Demon Slayer\' OR series = \'Hunter x Hunter\' AND category = \'Brawler\''
      );

      for (let index = 0; index < eliteBrawler.length; index++) {
        const { id } = eliteBrawler[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${elite} + ${brawler} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            elite / 2
          } + ${brawler / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeABrawler = await mysql(
        'SELECT id FROM players WHERE series = \'Black Clover\' OR series = \'Solo Leveling\' OR series = \'The God of High School\' OR series = \'The Seven Deadly Sins\' OR series = \'Fire Force\' OR series = \'Yu Yu Hakusho\' OR series = \'TBATE\' OR series = \'Full Metal Alchemist\' OR series = \'Inuyasha\' OR series = \'Sailor Moon\' OR series = \'Rurouni Kenshin\' AND category = \'Brawler\''
      );

      for (let index = 0; index < gradeABrawler.length; index++) {
        const { id } = gradeABrawler[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeA} + ${brawler} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeA / 2
          } + ${brawler / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeBBrawler = await mysql(
        'SELECT id FROM players WHERE series = \'Latna Saga: Survival of…\' OR series = \'Soul Eater\' OR series = \'Tensei Slime\' OR series = \'The Great Mage Returns\' OR series = \'Omniscient Reader\' OR series = \'Death Note\' OR series = \'KonoSuba\' OR series = \'Gundam Wing\' OR series = \'Katekyo Hitman Reborn!\' OR series = \'Shield Hero\' OR series = \'Cowboy Bebop\' OR series = \'Trigun\' OR series = \'Magic Emperor\' OR series = \'Martial Arts Reigns\' OR series = \'Versatile Mage\' OR series = \'Unordinary\' OR series = \'Akira\' AND category = \'Brawler\''
      );

      for (let index = 0; index < gradeBBrawler.length; index++) {
        const { id } = gradeBBrawler[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeB} + ${brawler} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeB / 2
          } + ${brawler / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeCBrawler = await mysql(
        'SELECT id FROM players WHERE series = \'Blue Exorcist\' OR series = \'Magi\' OR series = \'Digimon\' OR series = \'Boondocks\' OR series = \'Dr. Stone\' OR series = \'Yu-Gi-Oh!\' OR series = \'Paranoia Agent\' OR series = \'No Series\' OR series = \'Berserk\' AND category = \'Brawler\''
      );

      for (let index = 0; index < gradeCBrawler.length; index++) {
        const { id } = gradeCBrawler[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeC} + ${brawler} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeC / 2
          } + ${brawler / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }
    }

    /*****************
     * Supports
     * ***************/
    if (update === 'support') {
      const goatSupport = await mysql(
        'SELECT id FROM players WHERE series = \'DBZ\' AND category = \'Support\''
      );

      for (let index = 0; index < goatSupport.length; index++) {
        const { id } = goatSupport[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${goat} + ${support} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            goat / 2
          } + ${support / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const eliteSupport = await mysql(
        'SELECT id FROM players WHERE series = \'One Punch Man\' OR series = \'One Piece\' OR series = \'Naruto\' OR series = \'My Hero Academia\' OR series = \'Bleach\' OR series = \'Jujutsu Kaisen\' OR series = \'Attack on Titan\' OR series = \'Fairy Tail\' OR series = \'Demon Slayer\' OR series = \'Hunter x Hunter\' AND category = \'Support\''
      );

      for (let index = 0; index < eliteSupport.length; index++) {
        const { id } = eliteSupport[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${elite} + ${support} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            elite / 2
          } + ${support / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeASupport = await mysql(
        'SELECT id FROM players WHERE series = \'Black Clover\' OR series = \'Solo Leveling\' OR series = \'The God of High School\' OR series = \'The Seven Deadly Sins\' OR series = \'Fire Force\' OR series = \'Yu Yu Hakusho\' OR series = \'TBATE\' OR series = \'Full Metal Alchemist\' OR series = \'Inuyasha\' OR series = \'Sailor Moon\' OR series = \'Rurouni Kenshin\' AND category = \'Support\''
      );

      for (let index = 0; index < gradeASupport.length; index++) {
        const { id } = gradeASupport[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeA} + ${support} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeA / 2
          } + ${support / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeBSupport = await mysql(
        'SELECT id FROM players WHERE series = \'Latna Saga: Survival of…\' OR series = \'Soul Eater\' OR series = \'Tensei Slime\' OR series = \'The Great Mage Returns\' OR series = \'Omniscient Reader\' OR series = \'Death Note\' OR series = \'KonoSuba\' OR series = \'Gundam Wing\' OR series = \'Katekyo Hitman Reborn!\' OR series = \'Shield Hero\' OR series = \'Cowboy Bebop\' OR series = \'Trigun\' OR series = \'Magic Emperor\' OR series = \'Martial Arts Reigns\' OR series = \'Versatile Mage\' OR series = \'Unordinary\' OR series = \'Akira\' AND category = \'Support\''
      );

      for (let index = 0; index < gradeBSupport.length; index++) {
        const { id } = gradeBSupport[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeB} + ${support} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeB / 2
          } + ${support / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeCSupport = await mysql(
        'SELECT id FROM players WHERE series = \'Blue Exorcist\' OR series = \'Magi\' OR series = \'Digimon\' OR series = \'Boondocks\' OR series = \'Dr. Stone\' OR series = \'Yu-Gi-Oh!\' OR series = \'Paranoia Agent\' OR series = \'No Series\' OR series = \'Berserk\' AND category = \'Support\''
      );

      for (let index = 0; index < gradeCSupport.length; index++) {
        const { id } = gradeCSupport[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeC} + ${support} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeC / 2
          } + ${support / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }
    }

    /*****************
     * Villains
     * ***************/
    if (update === 'villain') {
      const goatVillain = await mysql(
        'SELECT id FROM players WHERE series = \'DBZ\' AND category = \'Villain\''
      );

      for (let index = 0; index < goatVillain.length; index++) {
        const { id } = goatVillain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${goat} + ${villain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            goat / 2
          } + ${villain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const eliteVillain = await mysql(
        'SELECT id FROM players WHERE series = \'One Punch Man\' OR series = \'One Piece\' OR series = \'Naruto\' OR series = \'My Hero Academia\' OR series = \'Bleach\' OR series = \'Jujutsu Kaisen\' OR series = \'Attack on Titan\' OR series = \'Fairy Tail\' OR series = \'Demon Slayer\' OR series = \'Hunter x Hunter\' AND category = \'Villain\''
      );

      for (let index = 0; index < eliteVillain.length; index++) {
        const { id } = eliteVillain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${elite} + ${villain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            elite / 2
          } + ${villain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeAVillain = await mysql(
        'SELECT id FROM players WHERE series = \'Black Clover\' OR series = \'Solo Leveling\' OR series = \'The God of High School\' OR series = \'The Seven Deadly Sins\' OR series = \'Fire Force\' OR series = \'Yu Yu Hakusho\' OR series = \'TBATE\' OR series = \'Full Metal Alchemist\' OR series = \'Inuyasha\' OR series = \'Sailor Moon\' OR series = \'Rurouni Kenshin\' AND category = \'Villain\''
      );

      for (let index = 0; index < gradeAVillain.length; index++) {
        const { id } = gradeAVillain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeA} + ${villain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeA / 2
          } + ${villain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeBVillain = await mysql(
        'SELECT id FROM players WHERE series = \'Latna Saga: Survival of…\' OR series = \'Soul Eater\' OR series = \'Tensei Slime\' OR series = \'The Great Mage Returns\' OR series = \'Omniscient Reader\' OR series = \'Death Note\' OR series = \'KonoSuba\' OR series = \'Gundam Wing\' OR series = \'Katekyo Hitman Reborn!\' OR series = \'Shield Hero\' OR series = \'Cowboy Bebop\' OR series = \'Trigun\' OR series = \'Magic Emperor\' OR series = \'Martial Arts Reigns\' OR series = \'Versatile Mage\' OR series = \'Unordinary\' OR series = \'Akira\' AND category = \'Villain\''
      );

      for (let index = 0; index < gradeBVillain.length; index++) {
        const { id } = gradeBVillain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeB} + ${villain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeB / 2
          } + ${villain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeCVillain = await mysql(
        'SELECT id FROM players WHERE series = \'Blue Exorcist\' OR series = \'Magi\' OR series = \'Digimon\' OR series = \'Boondocks\' OR series = \'Dr. Stone\' OR series = \'Yu-Gi-Oh!\' OR series = \'Paranoia Agent\' OR series = \'No Series\' OR series = \'Berserk\' AND category = \'Villain\''
      );

      for (let index = 0; index < gradeCVillain.length; index++) {
        const { id } = gradeCVillain[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeC} + ${villain} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeC / 2
          } + ${villain / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }
    }

    /*****************
     * Battlefields
     * ***************/
    if (update === 'battlefield') {
      const goatBattlefield = await mysql(
        'SELECT id FROM players WHERE series = \'DBZ\' AND category = \'Battlefield\''
      );

      for (let index = 0; index < goatBattlefield.length; index++) {
        const { id } = goatBattlefield[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${goat} + ${battlefield} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            goat / 2
          } + ${battlefield / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const eliteBattlefield = await mysql(
        'SELECT id FROM players WHERE series = \'One Punch Man\' OR series = \'One Piece\' OR series = \'Naruto\' OR series = \'My Hero Academia\' OR series = \'Bleach\' OR series = \'Jujutsu Kaisen\' OR series = \'Attack on Titan\' OR series = \'Fairy Tail\' OR series = \'Demon Slayer\' OR series = \'Hunter x Hunter\' AND category = \'Battlefield\''
      );

      for (let index = 0; index < eliteBattlefield.length; index++) {
        const { id } = eliteBattlefield[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${elite} + ${battlefield} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            elite / 2
          } + ${battlefield / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeABattlefield = await mysql(
        'SELECT id FROM players WHERE series = \'Black Clover\' OR series = \'Solo Leveling\' OR series = \'The God of High School\' OR series = \'The Seven Deadly Sins\' OR series = \'Fire Force\' OR series = \'Yu Yu Hakusho\' OR series = \'TBATE\' OR series = \'Full Metal Alchemist\' OR series = \'Inuyasha\' OR series = \'Sailor Moon\' OR series = \'Rurouni Kenshin\' AND category = \'Battlefield\''
      );

      for (let index = 0; index < gradeABattlefield.length; index++) {
        const { id } = gradeABattlefield[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeA} + ${battlefield} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeA / 2
          } + ${battlefield / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeBBattlefield = await mysql(
        'SELECT id FROM players WHERE series = \'Latna Saga: Survival of…\' OR series = \'Soul Eater\' OR series = \'Tensei Slime\' OR series = \'The Great Mage Returns\' OR series = \'Omniscient Reader\' OR series = \'Death Note\' OR series = \'KonoSuba\' OR series = \'Gundam Wing\' OR series = \'Katekyo Hitman Reborn!\' OR series = \'Shield Hero\' OR series = \'Cowboy Bebop\' OR series = \'Trigun\' OR series = \'Magic Emperor\' OR series = \'Martial Arts Reigns\' OR series = \'Versatile Mage\' OR series = \'Unordinary\' OR series = \'Akira\' AND category = \'Battlefield\''
      );

      for (let index = 0; index < gradeBBattlefield.length; index++) {
        const { id } = gradeBBattlefield[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeB} + ${battlefield} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeB / 2
          } + ${battlefield / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }

      const gradeCBattlefield = await mysql(
        'SELECT id FROM players WHERE series = \'Blue Exorcist\' OR series = \'Magi\' OR series = \'Digimon\' OR series = \'Boondocks\' OR series = \'Dr. Stone\' OR series = \'Yu-Gi-Oh!\' OR series = \'Paranoia Agent\' OR series = \'No Series\' OR series = \'Berserk\' AND category = \'Battlefield\''
      );

      for (let index = 0; index < gradeCBattlefield.length; index++) {
        const { id } = gradeCBattlefield[index];

        await mysql(
          `UPDATE players AS p1 INNER JOIN( SELECT fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE id = ? ) AS p2 SET p1.power_level = (${gradeC} + ${battlefield} + IF(p2.fire > 0, 100, 0) + IF(p2.water > 0, 100, 0) + IF(p2.wind > 0, 100, 0) + IF(p2.earth > 0, 100, 0) + IF(p2.arcane > 0, 100, 0) + IF(p2.electric > 0, 100, 0) + IF(p2.celestrial > 0, 100, 0) + IF(p2.darkness > 0, 100, 0) + IF(p2.ice > 0, 100, 0) + IF(p2.no_affinity > 0, 100, 0)), p1.cost = (${
            gradeC / 2
          } + ${battlefield / 2}) WHERE p1.id = ?`,
          [id, id]
        );
      }
    }

    /******************************
     * Remove No Affinity from
     * characters that have at
     * least 1 affinity
     * ***************************/
    if (update === 'affinity') {
      await mysql(
        'UPDATE players SET no_affinity = 0 WHERE no_affinity > 0 AND (category = \'Captain\' OR category = \'Brawler\') AND (fire > 0 OR water > 0 OR wind > 0 OR earth > 0 OR arcane > 0 OR electric > 0 OR celestrial > 0 OR darkness > 0 OR ice > 0)'
      );
      await mysql(
        'UPDATE players SET fire = 250 WHERE fire > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET water = 300 WHERE water > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET wind = 250 WHERE wind > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET earth = 300 WHERE earth > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET electric = 250 WHERE electric > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET arcane = 200 WHERE arcane > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET celestrial = 300 WHERE celestrial > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET darkness = 250 WHERE darkness > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET ice = 300 WHERE ice > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
      await mysql(
        'UPDATE players SET no_affinity = 350 WHERE no_affinity > 0 AND (category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\')'
      );
    }

    /******************************
     * Update Boosts and Damages
     * ***************************/
    if (update === 'support') {
      const players = await mysql(
        'SELECT id, fire, water, wind, earth, arcane, electric, celestrial, darkness, ice, no_affinity FROM players WHERE category = \'Support\' OR category = \'Villain\' OR category = \'Battlefield\''
      );

      for (let index = 0; index < players.length; index++) {
        const {
          id,
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
        } = players[index];

        const numAffinities =
          (fire > 0 ? 10 : 0) +
          (water > 0 ? 10 : 0) +
          (wind > 0 ? 10 : 0) +
          (earth > 0 ? 10 : 0) +
          (arcane > 0 ? 10 : 0) +
          (electric > 0 ? 10 : 0) +
          (celestrial > 0 ? 10 : 0) +
          (darkness > 0 ? 10 : 0) +
          (ice > 0 ? 10 : 0) +
          (no_affinity > 0 ? 10 : 0);

        await mysql(
          `UPDATE players SET fire = IF(${fire} > 0, (250 + ${numAffinities}), 0), water = IF(${water} > 0, (300 + ${numAffinities}), 0), wind = IF(${wind} > 0, (250 + ${numAffinities}), 0), earth = IF(${earth} > 0, (300 + ${numAffinities}), 0), arcane = IF(${arcane} > 0, (200 + ${numAffinities}), 0), electric = IF(${electric} > 0, (250 + ${numAffinities}), 0), celestrial = IF(${celestrial} > 0, (300 + ${numAffinities}), 0), darkness = IF(${darkness} > 0, (250 + ${numAffinities}), 0), ice = IF(${ice} > 0, (300 + ${numAffinities}), 0), no_affinity = IF(${no_affinity} > 0, (350 + ${numAffinities}), 0) WHERE id = ?`,
          [id]
        );
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Player Formula failed',
    });
  }
};
