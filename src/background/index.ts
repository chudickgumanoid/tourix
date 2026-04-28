chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'SET_BADGE' && sender.tab?.id) {
    const { text, color } = message.payload;
    
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: text
    });

    if (color) {
      chrome.action.setBadgeBackgroundColor({
        tabId: sender.tab.id,
        color: color
      });
    }
  }
});
