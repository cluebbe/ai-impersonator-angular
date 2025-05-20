import { Component, OnInit } from '@angular/core';
import { NotificationMessage } from '../notification-message.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  standalone: false,
})

export class NotificationComponent {
  notifications: NotificationMessage[] = [];


  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications from the service
    this.notificationService.notifications$.subscribe(
      (notifications) => (this.notifications = notifications)
    );
  }


}


