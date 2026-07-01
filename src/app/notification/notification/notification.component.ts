import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NotificationMessage } from '../notification-message.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})

export class NotificationComponent {

  constructor(public notificationService: NotificationService) {}

}


