// slack
var slackSettings = {};

// save token
// Before using the script, specify your SLACK TOKEN as a parameter and execute once.
function saveSlackToken(token) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('SLACK_ACCESS_TOKEN', token);
}

// load token
function loadSlackToken() {
  if (slackSettings.SLACK_ACCESS_TOKEN === undefined) {
    var userProperties = PropertiesService.getUserProperties();
    slackSettings.SLACK_ACCESS_TOKEN = userProperties.getProperty('SLACK_ACCESS_TOKEN');
  }
}

// slack event processing
function eventProcessing(data) {
  loadSlackToken();
  
  var resData = {};
  if (data.type === 'event_callback') {
    if (slackEventMap[data.event.type] !== undefined) {
      console.info('receive event = %s.', data.event.type);
      slackEventMap[data.event.type](data.event);
    }
  } else if (data.type === 'url_verification') {
    resData.challenge = data.challenge;
  }
  return ContentService.createTextOutput(JSON.stringify(resData)).setMimeType(ContentService.MimeType.JSON);
}

function getPrivateImage(url) {
  // set token
  var headers = {
    'Authorization': 'Bearer '+ slackSettings.SLACK_ACCESS_TOKEN
  };

  var options = {
    'method' : 'get',
    'headers' : headers
  };

  var response = UrlFetchApp.fetch(url, options);
  return response.getBlob();
}

function getFileInfo(id) {
  console.info('getFileInfo call. id = %s', id);
  var response = UrlFetchApp.fetch('https://slack.com/api/files.info?token=' + slackSettings.SLACK_ACCESS_TOKEN + '&file=' + id);
  if (response.getResponseCode() === 200) {
    console.log(response.getContentText());
    return JSON.parse(response.getContentText());
  } else {
    return null;
  }
}
