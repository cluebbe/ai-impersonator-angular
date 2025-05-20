import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, HeaderComponent, NotificationModule],
})

export class AppComponent {
  title = 'ai-impersonator-angular';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Add two dummy notifications on initialization
    this.notificationService.addNotification({
      type: 'ERROR',
      message: 'This is an error message.',
    });
    this.notificationService.addNotification({
      type: 'INFO',
      message: 'This is an info message.',
    });
  }

}
