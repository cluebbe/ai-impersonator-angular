import { Injectable, OnInit, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NotificationMessage } from './notification-message.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications = signal<NotificationMessage[]>([]);
  notifications$ = this.notifications.asReadonly();
  
  addNotification(notification: NotificationMessage) {
    this.notifications.update((prev) => [...prev, notification]);
   
    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 50000);
  }

  removeNotification(notification: NotificationMessage) {
    this.notifications.update(current =>
      current.filter(n => n !== notification)
    );
  }
}
