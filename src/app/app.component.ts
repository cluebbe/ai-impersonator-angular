import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NotificationModule } from './notification/notification.module';
import { OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NotificationService } from './notification/notification.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, HeaderComponent, NotificationModule],
})

export class AppComponent implements OnInit {
  title = 'ai-impersonator-angular';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.init();
  }

}
