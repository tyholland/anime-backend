const mailchimp = require('@mailchimp/mailchimp_marketing');
const mainListId = '809a3f862c';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

module.exports.client = mailchimp;

const updateCampaign = async (campaignId, subject, preview, segmentId) => {
  try {
    await mailchimp.campaigns.update(campaignId, {
      settings: {
        subject_line: subject,
        preview_text: preview,
      },
      recipients: {
        list_id: mainListId,
        segment_opts: {
          saved_segment_id: segmentId,
        },
      },
    });
  } catch (err) {
    throw new Error('Can not update campaign email');
  }
};

const getLeagueSegement = async (leagueName, leagueId) => {
  try {
    const data = await mailchimp.lists.listSegments(mainListId);
    const { segments } = data;

    const theList = segments.filter(
      (list) =>
        list.name === `${leagueName} - ${leagueId} - ${process.env.SERVER_ENV}`
    )[0];

    return theList.id;
  } catch (err) {
    throw new Error('Can not get league segment');
  }
};

module.exports.sendLeagueStartEmail = async (leagueName, leagueId) => {
  try {
    const segmentId = await getLeagueSegement(leagueName, leagueId);
    const subject = `${leagueName} has just started`;
    const preview = `${leagueName} started`;
    const campaignId = '318174';

    await updateCampaign(campaignId, subject, preview, segmentId);
    await mailchimp.campaigns.send(campaignId);
  } catch (err) {
    throw new Error('Can not send email for league starting');
  }
};

module.exports.sendLeagueEndedEmail = async (leagueName, leagueId) => {
  try {
    const segmentId = await getLeagueSegement(leagueName, leagueId);
    const subject = `${leagueName} has just ended`;
    const preview = `${leagueName} ended`;
    const campaignId = '318345';

    await updateCampaign(campaignId, subject, preview, segmentId);
    await mailchimp.campaigns.send(campaignId);
  } catch (err) {
    throw new Error('Can not send email for league ending');
  }
};

module.exports.sendLeagueDeletedEmail = async (leagueName, leagueId) => {
  try {
    const segmentId = await getLeagueSegement(leagueName, leagueId);
    const subject = `${leagueName} was deleted`;
    const preview = `${leagueName} deleted`;
    const campaignId = '318352';

    await updateCampaign(campaignId, subject, preview, segmentId);
    await mailchimp.campaigns.send(campaignId);
  } catch (err) {
    throw new Error('Can not send email for league being deleted');
  }
};

module.exports.addLeagueSegment = async (leagueName, leagueId, email) => {
  const segment = `${leagueName} - ${leagueId} - ${process.env.SERVER_ENV}`;

  try {
    const { id } = await mailchimp.lists.createSegment(mainListId, {
      name: segment,
    });

    await mailchimp.lists.createSegmentMember(mainListId, id, {
      email_address: email,
    });
  } catch (err) {
    console.log(err);
    throw new Error('Can not add new segment for league');
  }
};

module.exports.addMemberToList = async (email) => {
  try {
    await mailchimp.lists.addListMember(mainListId, {
      email_address: email,
      status: 'subscribed',
      tags: [process.env.SERVER_ENV],
    });
  } catch (err) {
    console.log(err);
    throw new Error('Can not add member to list');
  }
};

module.exports.addMemberToSegment = async (leagueName, leagueId, email) => {
  try {
    const segmentId = await getLeagueSegement(leagueName, leagueId);

    await mailchimp.lists.createSegmentMember(mainListId, segmentId, {
      email_address: email,
    });
  } catch (err) {
    console.log(err);
    throw new Error('Can not add member to segment');
  }
};
