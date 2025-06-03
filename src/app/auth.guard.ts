import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification/notification.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.isAuthenticated()) {
    return true; // Allow access
  } else {

    notificationService.addNotification({
      type: 'ERROR',
      message: 'You must be logged in to access this page.',
    });
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

  
    return false; // Deny access
  }
};
