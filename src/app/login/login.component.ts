import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';


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
  private returnUrl: string = '/dashboard';

  constructor(
    private router: Router,
    public authService: AuthService,
    public notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    // Get returnUrl from query params or default to '/dashboard'
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  // Stub for login method
  login() {
    this.authService.login(this.username, this.password);
    if (this.authService.isAuthenticated()) {
      console.log('Login successful');
      this.router.navigate([this.returnUrl]);
    } else {
      console.error('Login failed');
      this.notificationService.addNotification({
        type: 'ERROR',
        message: 'Login failed. Please check your username and password.',
      });
    }
  }
}
