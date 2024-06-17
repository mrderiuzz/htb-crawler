function getContent_(url){
  let content = UrlFetchApp.fetch(url).getContentText();
  return Cheerio.load(content);
}

function areEventsPublished(month, year, day){
  let url = `https://hittheball.pl/get_events.php?date=${year}-${month}-${day}`;
  console.info("checking training for: ", url)
  let $ = getContent_(url);
  return $('body > div.alert').html() ? false : true
}

function app(){
  let scriptProperties = PropertiesService.getScriptProperties();
  const d = new Date();
  let current_day = d.getDate();
  let next_month = (d.getMonth() + 2).toString().padStart(2, '0');
  let current_year = d.getFullYear();
  let trainings_published = areEventsPublished(next_month, current_year, current_day);
  console.info("training published: ", trainings_published);
  console.info({current_day, next_month, current_year});
  console.info("notification sent this month? ", scriptProperties.getProperty(notification_storage_name), typeof scriptProperties.getProperty(notification_storage_name));
  if(trainings_published && scriptProperties.getProperty(notification_storage_name)=="0"){
      console.info("training published, not emailed yet!")
      sendNotification();
      scriptProperties.setProperty(notification_storage_name, "1");
      console.info("emailed successfully, marked as email sent");
  }
}

function clearSentStatus(){
  let scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(notification_storage_name, "0");
  console.info("reset notification sent status for this month");
}