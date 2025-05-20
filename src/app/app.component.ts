import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NotificationModule } from './notification/notification.module';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, HeaderComponent, NotificationModule],
})

export class AppComponent {
  title = 'ai-impersonator-angular';
}
