import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const _jwtHelper = inject(JwtHelperService);

    // const token = localStorage.getItem('securityKey');
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEwNjgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiUlZDQVBJVEFMRlVORFNcXHYtc2phaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ2LXNqYWluQHJ2Y2FwaXRhbGZ1bmRzLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOIiwiZXhwIjoxNzU3NTEwMjAzMCwiaXNzIjoicnZfYXBpIiwiYXVkIjoicnZfd2ViIn0.6sxn-FG6NIuqBZdD3q4fJmF4HmwxQ4kSgsAPH1cg_lw';
    if (token) {
        const decodedToken: any = _jwtHelper.decodeToken(token);
        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('securityKey');
            router.navigate(['/login']);
            return true;
        }

        return true;
        const userRole = decodedToken.roleId;

        const expectedRole = route.data['expectedRole'];
        if (userRole && expectedRole.includes(userRole)) {
            return true;
        } else {
            // if(userRole == '66fbb54940efed7cfaf3b39a'){ //Front desk Role
            //     router.navigate(['/booking/list']);
            // }
            // else if(userRole == '66fbb55b40efed7cfaf3b39c' || userRole == '66fbb52e40efed7cfaf3b398'){ // Collection Partner Role or Customer Role
            //     localStorage.removeItem('securityKey');
            //     router.navigate(['/login']);
            // }
            return false;
        }
    } else {
        router.navigate(['/login']);
        return true;
    }
};
