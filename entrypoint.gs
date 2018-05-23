// executed when receive a post.
function doPost(e) {
  var jsonString = e.postData.getDataAsString();
  var data = JSON.parse(jsonString);
  return eventProcessing(data);
}

// for Test or save token.
function myFunction() {
  doPost({
    postData: {
      getDataAsString: function () {
        return '{"type":"event_callback", "event":{"type":"file_created","file":{"id":"XXXXXXXXX"},"file_id":"XXXXXXXXX","user_id":"XXXXXXXXX","event_ts":"1526713669.000085"}}';
      }
    }
  });
}

// Function Map
var slackEventMap = {
  file_created: processFileCreated
};

// set your google drive folder id
// If the folder URL is https://drive.google.com/drive/folders/xxxxxxxxxxxxxxxxxxxxxxxx
// id is xxxxxxxxxxxxxxxxxxxxxxxx.
var applicationFileFolderId = 'xxxxxxxxxxxxxxxxxxxxxxxx';

// executed when receive file created event.
function processFileCreated(event) {
  // Get file info from slack.
  var res = getFileInfo(event.file.id);

  // Download Image
  var blob = getPrivateImage(res.file.url_private_download);
  
  // save my googel driver
  var folder = DriveApp.getFolderById(applicationFileFolderId);
  folder.createFile(blob);
}
