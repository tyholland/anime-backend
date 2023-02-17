const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

module.exports.client = mailchimp;

const updateCampaign = async (listId, campaignId, subject, preview) => {
  try {
    await mailchimp.campaigns.update(campaignId, {
      settings: {
        subject_line: subject,
        preview_text: preview,
      },
      recipients: {
        list_id: listId,
      },
    });
  } catch (err) {
    throw new Error('Can not update campaign email');
  }
};

module.exports.getLeagueList = async (leagueName, leagueId) => {
  try {
    const data = await mailchimp.lists.getAllLists();
    const { lists } = data;

    const theList = lists.filter(
      (list) =>
        list.name === `${leagueName} - ${leagueId} - ${process.env.SERVER_ENV}`
    )[0];

    return theList.id;
  } catch (err) {
    throw new Error('Can not get league list');
  }
};

module.exports.sendLeagueStartEmail = async (leagueName, leagueId) => {
  try {
    const listId = await this.getLeagueList(leagueName, leagueId);
    const subject = `${leagueName} has just started`;
    const preview = `${leagueName} started`;
    const campaignId = '318174';

    await updateCampaign(listId, campaignId, subject, preview);
    await mailchimp.campaigns.send(campaignId);
  } catch (err) {
    throw new Error('Can not send email for league starting');
  }
};

module.exports.sendLeagueEndedEmail = async (leagueName, leagueId) => {
  try {
    const listId = await this.getLeagueList(leagueName, leagueId);
    const subject = `${leagueName} has just ended`;
    const preview = `${leagueName} ended`;
    const campaignId = '318345';

    await updateCampaign(listId, campaignId, subject, preview);
    await mailchimp.campaigns.send(campaignId);
  } catch (err) {
    throw new Error('Can not send email for league ending');
  }
};

module.exports.sendLeagueDeletedEmail = async (leagueName, leagueId) => {
  try {
    const listId = await this.getLeagueList(leagueName, leagueId);
    const subject = `${leagueName} was deleted`;
    const preview = `${leagueName} deleted`;
    const campaignId = '318352';

    await updateCampaign(listId, campaignId, subject, preview);
    await mailchimp.campaigns.send(campaignId);
  } catch (err) {
    throw new Error('Can not send email for league being deleted');
  }
};

module.exports.addLeagueList = async (leagueName, leagueId) => {
  try {
    const { id } = await mailchimp.lists.createList({
      name: `${leagueName} - ${leagueId} - ${process.env.SERVER_ENV}`,
      permission_reminder: `You are receiving this email because you joined the Anime Fantasy League, ${leagueName}`,
      email_type_option: true,
      contact: {
        company: 'ABZ',
        address1: process.env.MAILCHIMP_STREET,
        city: process.env.MAILCHIMP_CITY,
        country: 'USA',
      },
      campaign_defaults: {
        from_name: 'Anime Brothaz',
        from_email: 'animebrothaz3@gmail.com',
        subject: `Welcome to ${leagueName}`,
        language: 'english',
      },
    });

    return id;
  } catch (err) {
    throw new Error('Can not add new list for league');
  }
};

module.exports.addMemberToList = async (listId, email) => {
  try {
    await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'subscribed',
      tags: [process.env.SERVER_ENV],
    });
  } catch (err) {
    throw new Error('Can not add member to list');
  }
};
