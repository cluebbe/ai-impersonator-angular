import { Component, OnInit } from '@angular/core';
import { NotificationMessage } from '../notification-message.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  standalone: false,
})

export class NotificationComponent implements OnInit{
  notifications: NotificationMessage[] = [];

  ngOnInit(): void {
    // Add two dummy notifications on initialization
    this.addNotification({ type: 'ERROR', message: 'This is an error message.' });
    this.addNotification({ type: 'INFO', message: 'This is an info message.' });
  }

  addNotification(notification: NotificationMessage) {
    this.notifications.push(notification);
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);
  }

  removeNotification(notification: NotificationMessage ) {
    this.notifications.shift();
  }
}


