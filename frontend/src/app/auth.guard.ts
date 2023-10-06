import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from './users.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(UsersService).isAuthenticated()
  const router = inject(Router)

  if (isAuthenticated) {
    return true
  }

  return router.parseUrl('/login');
};
