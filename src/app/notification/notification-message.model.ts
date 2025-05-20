export interface NotificationMessage {
    type: 'ERROR' | 'INFO'; // The type of the notification
    message: string;        // The message to display
  }