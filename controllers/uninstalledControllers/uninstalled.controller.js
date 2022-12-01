const knex = require('../../utils/knex').instance();
const { formatDate } = require('../../utils');

//Get all uninstalled
module.exports.getAllUninstalled = (req, res) => {
  knex('uninstalled')
    .select('*')
    .then((uninstalled) => res.status(200).json({ uninstalled: uninstalled }))
    .catch((err) => res.status(500).json({ message: 'Something went wrong', error: err }));
};

//Get one uninstalled by Id
module.exports.getOneUninstalled = (req, res) =>{
  knex('uninstalled')
    .where({uninstall_id: req.params.id})
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
};

//Create an uninstalled
module.exports.addUninstalled = (req, res) => {
  const { annoyed, canada, cashback, shop, technical, useful, work, sizing, other, other_response } = req.body;
  console.log(req.body);
  const formattedDate = formatDate();
  knex('uninstalled')
    .insert({
      annoyed: annoyed,
      canada: canada,
      cashback: cashback,
      shop: shop,
      technical: technical,
      useful: useful,
      work: work,
      created_on: formattedDate,
      other: other,
      other_response: other_response,
      sizing: sizing

    }, // this array tells the function what columns to return from the db ↓
    ['uninstall_id', 'annoyed', 'canada', 'cashback', 'shop', 'technical', 'useful', 'work', 'sizing', 'other', 'other_response']
    )
    .then(user => res.status(200).json(user[0]))
    .catch(err => res.status(500).json(err));
};


//Update an uninstalled
module.exports.updateUninstalled = (req, res) =>{
  const { annoyed, canada, cashback, shop, technical, useful, work, sizing, other, other_response } = req.body;
  knex('uninstalled').where({uninstall_id : req.params.id}).update({
    annoyed: annoyed,
    canada: canada,
    cashback: cashback,
    shop: shop,
    technical: technical,
    useful: useful,
    work: work,
    sizing: sizing,
    other: other,
    other_response: other_response,
  },
  ['uninstall_id', 'annoyed', 'canada', 'cashback', 'shop', 'technical', 'useful', 'work', 'sizing', 'other', 'other_response']
  )
    .then(user => res.status(200).json(user[0]))
    .catch(err => res.status(500).json(err));
};


//Delete an uninstalled
module.exports.deleteUninstalled = (req, res) =>{
  knex('uninstalled')
    .where({uninstall_id: req.params.id })
    .del()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
};
