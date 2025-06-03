import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification/notification.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const expectedRole = route.data['role'];

  if (authService.isAuthenticated()) {
    if (expectedRole) {
      const userRole = authService.getCurrentUserRole();
      if (userRole === expectedRole) {
        return true;
      } else {
        notificationService.addNotification({
        type: 'ERROR',
        message: 'Insufficient rights to access this page.',
    });
        return false;
      }
    }
    return true; // Allow access if authenticated and no specific role is required
  } else {

    notificationService.addNotification({
      type: 'ERROR',
      message: 'You must be logged in to access this page.',
    });
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

  
    return false; // Deny access
  }
};
