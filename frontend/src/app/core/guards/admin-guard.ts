import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.getUser().pipe(
    take(1),
    map((user) => {
      if (user && user.is_admin) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
