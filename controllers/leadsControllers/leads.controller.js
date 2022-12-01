const knex = require('../../utils/knex').instance();
const { formatDate, validateInput } = require('../../utils');
const { sendEmail } = require('../../utils/mailer');

// Get all leads
module.exports.getAllLeads = (req, res) => {
  knex('leads')
    .select('*')
    .then((allLeads) => res.status(200).json({ Leads: allLeads }))
    .catch((err) =>
      res.status(500).json({ message: 'Something went wrong', error: err })
    );
};

//Get one lead by id
module.exports.getOneLead = (req, res) => {
  knex('leads')
    .where('lead_id', req.params.id)
    .then((lead) => res.status(200).json(lead))
    .catch((err) => res.status(500).json(err));
};

//Create a lead
module.exports.addLead = async (userInfo, res) => {
  const { first_name, last_name, email, source, affiliate, prime, zip } = userInfo.body;
  const formattedDate = formatDate();
  if (validateInput({ email: email }).length) {
    return res.status(400).send({
      status: 'error',
      message: 'The email entered is not a vaild email address',
    });
  }
  if (validateInput({ zip: zip }).length) {
    return res.status(400).send({
      status: 'error',
      message: 'Your zip code is not the correct length',
    });
  }
  knex('leads')
    .insert(
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        created_on: formattedDate,
        source: source,
        affiliate: affiliate,
        prime: prime,
        zip: zip
      }, //this array tells the function what columns to return from the db ↓
      ['lead_id', 'first_name', 'last_name', 'email', 'created_on', 'source', 'affiliate', 'prime', 'zip']
    )
    .then((lead) => res.status(200).json(lead[0])) // lead[0] because it returns an array with an object in it.
    .catch((err) => res.status(500).json(err));

  //send email to freedomrains about new lead
  var subject = `New Lead Info - ${first_name} ${last_name}`;
  var text = `Name: ${first_name} ${last_name}
  Email: ${email}
  Source:: ${source}
  Affiliate: ${affiliate}
  Prime: ${prime}
  Zip: ${zip}`;
  await sendEmail(email, 'info@freedomrains.com', subject, text)
    .then(res.status(200).send('Notified Freedomrains of new lead.')
      .catch(res.status(500).end()));
};

//Update a lead
module.exports.updateLead = (req, res) => {
  const { first_name, last_name, email, source, affiliate, prime, zip } = req.body;
  knex('leads')
    .where({ lead_id: req.params.id })
    .update(
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        source: source,
        affiliate: affiliate,
        prime: prime,
        zip: zip
      }, //this array tells the function what columns to return from the db ↓
      ['lead_id', 'first_name', 'last_name', 'email', 'created_on', 'source', 'affiliate', 'prime', 'zip']
    )
    .then((lead) => res.status(200).json(lead[0]))
    .catch((err) => res.status(500).json(err));
};

//Delete a lead
module.exports.deleteLead = (req, res) => {
  knex('leads')
    .where({ lead_id: req.params.id })
    .del()
    .then((lead) => res.status(200).json(lead))
    .catch((err) => res.status(500).json(err));
};
