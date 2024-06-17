function sendNotification(){
  let d = new Date();
  let next_month = d.getMonth()+1; //next month
  let polskie_nazwy_miesiecy = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", 'listopad', 'grudzień'];
  
  var htbLogoBlob = UrlFetchApp
                         .fetch('https://4real.pl/files/pl/mini/htb-1611745162.webp')
                         .getBlob()
                         .setName("HtbLogoBlob");
  MailApp.sendEmail({
    to: "grzywaczdariusz@gmail.com",
    subject: `HitTheBall: treningi na ${polskie_nazwy_miesiecy[next_month]} opublikowane`,
    htmlBody: "<strong><a href='https://hittheball.pl/kalendarz' target='_blank'>ZAPISY I TERMINY<a/></strong> <br><br>"+
    "Game on, <img src='cid:htbLogoBlob'><br>" +
    "Hit The Ball 🏓",
    inlineImages:
      {
        htbLogo: htbLogoBlob,
      }
  });
}

