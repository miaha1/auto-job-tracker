function extractJobLinks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // search for email newer than 2 months
  const threads = GmailApp.search('label:job-alerts is:unread newer_than:2m');
  
  let newDataAdded = false; 
  
  const lastRow = sheet.getLastRow();
  let existingLinks = new Set();
  if (lastRow > 1) {
    const existingData = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
    existingData.flat().forEach(link => existingLinks.add(link));
  }
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    
    messages.forEach(message => {
      if (message.isUnread()) {
        const rawDate = message.getDate();
        const timeZone = Session.getScriptTimeZone();
        const date = Utilities.formatDate(rawDate, timeZone, 'yyyy-MM-dd');
        const time = Utilities.formatDate(rawDate, timeZone, 'hh:mm a'); 
        
        const subject = message.getSubject();
        const body = message.getPlainBody(); 
        
        const urlRegex = /(https?:\/\/[^\s"'<>]+)/g;
        const links = body.match(urlRegex);
        
        if (links) {
          links.forEach(link => {
            
            // Aggressive Tracking Stripper
            let cleanLink = link.split('?utm_')[0];
            cleanLink = cleanLink.split('&utm_')[0];
            cleanLink = cleanLink.split('?trk=')[0]; 
            cleanLink = cleanLink.split('&trk=')[0]; 
            cleanLink = cleanLink.split('?from=')[0]; 
            
            // Aggressive Junk Word List to prevent unrelevant non jobs link
            const junkWords = [
              "unsubscribe", "privacy", "terms", "login", "signup", 
              "help", "settings", "apple.com", "google.com/store", 
              "password", "preferences", "support", "feedback", 
              "opt-out", "optout", "notifications",
              "profile", "not-interested", "dislike", "survey", "about"
            ];
            
            const isJunk = junkWords.some(word => cleanLink.toLowerCase().includes(word));
            
            if (!isJunk && !existingLinks.has(cleanLink)) {
               sheet.appendRow([date, time, subject, cleanLink]);
               existingLinks.add(cleanLink); 
               newDataAdded = true;
            }
          });
        }
        
        // Marks the email as read so tomorrow it only scans brand new emails
        message.markRead();
      }
    });
  });
  
  // Sorts newest jobs to the top
  if (newDataAdded) {
    const newLastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    if (newLastRow > 1) {
      const range = sheet.getRange(2, 1, newLastRow - 1, lastCol);
      range.sort([
        {column: 1, ascending: false}, 
        {column: 2, ascending: false}
      ]);
    }
  }
}
