import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state,
) => {
    const router: Router = inject(Router);

    // Check the authentication status
    const securityKey = localStorage.getItem('securityKey');
    // const userRole = localStorage.getItem('userRole');

    if (securityKey) {
        console.log('securityKey', securityKey);
        router.navigate(['/']);
        return of(false);
    }

    // Allow the access
    return of(true);
};
