import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../notification/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports : [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  public username = '';
  public password = '';

  constructor(public router: Router, public authService: AuthService, public notificationService: NotificationService) {}

  // Stub for login method
  login() {
    this.authService.login(this.username, this.password);
    if (this.authService.isAuthenticated()) {
      console.log('Login successful');
      this.router.navigate(['/dashboard']);
    } else {
      console.error('Login failed');
      this.notificationService.addNotification({
        type: 'ERROR',
        message: 'Login failed. Please check your username and password.',
      });
    }
  }
}
