import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NotificationMessage } from './notification-message.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 
  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  addNotification(notification: NotificationMessage) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 50000);
  }

  removeNotification(notification: NotificationMessage) {
    const currentNotifications = this.notificationsSubject.value.filter(
      (n) => n !== notification
    );
    this.notificationsSubject.next(currentNotifications);
  }
}
