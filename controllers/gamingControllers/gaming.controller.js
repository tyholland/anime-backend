const knex = require('../../utils/knex').instance();

module.exports.getGamer = (req, res) => {
  knex('gaming_user_data')
    .select('*')
    .then((allGamers) => res.status(200).json({ gaming_user_data: allGamers }))
    .catch((err) => res.status(500).json({ message: 'Something went wrong', error: err }));
};

module.exports.addGamer = (userInfo, res) => {
  const { acct_username, gaming_id, users_highest_score, curr_level, time_played, bubbleshot, curr_tokens, x_levels_completed, number_comm_tokens, event_id, user_id} = userInfo.body;
  knex('gaming_user_data')
    .insert({
      acct_username: acct_username, 
      gaming_id: gaming_id, 
      users_highest_score: users_highest_score, 
      curr_level: curr_level, 
      time_played: time_played, 
      bubbleshot: bubbleshot, 
      curr_tokens: curr_tokens, 
      x_levels_completed: x_levels_completed, 
      number_comm_tokens: number_comm_tokens, 
      event_id: event_id,
      user_id: user_id
    }, ['acct_username', 'gaming_id', 'users_highest_score', 'curr_level', 'time_played', 'bubbleshot', 'curr_tokens', 'x_levels_completed', 'number_comm_tokens', 'event_id', 'user_id']
    )
    .then((gamingUsers) => res.status(200).json(gamingUsers[0])) 
    .catch((err) => res.status(500).json(err));
};

module.exports.deleteGamer = (req, res) => {
  knex('gaming_user_data')
    .where({ user_id: req.params.id })
    .del()
    .then((deletedUser) => res.status(200).json(deletedUser))
    .catch((err) => res.status(500).json(err));
};

module.exports.updateGamer = (req, res) => {
  knex('gaming_user_data')
    .where({ user_id: req.params.id })
    .update(
      {
        acct_username: req.body.acct_username, 
        gaming_id: req.body.gaming_id, 
        users_highest_score: req.body.users_highest_score, 
        curr_level: req.body.curr_level, 
        time_played: req.body.time_played, 
        bubbleshot: req.body.bubbleshot, 
        curr_tokens: req.body.curr_tokens, 
        x_levels_completed: req.body.x_levels_completed, 
        number_comm_tokens: req.body.number_comm_tokens, 
        event_id: req.body.event_id,
        user_id: req.body.user_id
      }, ['acct_username', 'gaming_id', 'users_highest_score', 'curr_level', 'time_played', 'bubbleshot', 'curr_tokens', 'x_levels_completed', 'number_comm_tokens', 'event_id', 'user_id']
    )
    .then((gamingUser) => res.status(200).json(gamingUser[0]))
    .catch((err) => res.status(500).json(err));  
};

