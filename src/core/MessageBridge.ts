import { ExtensionMessage } from './types';

export class MessageBridge {
  static sendMessageToTab(tabId: number, message: ExtensionMessage): Promise<any> {
    return chrome.tabs.sendMessage(tabId, message);
  }

  static onMessage(callback: (message: ExtensionMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void) {
    chrome.runtime.onMessage.addListener(callback);
  }
}
