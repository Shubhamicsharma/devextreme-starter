import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const _jwtHelper = inject(JwtHelperService);

    const token = localStorage.getItem('securityKey');
    if (token) {
        const decodedToken: any = _jwtHelper.decodeToken(token);
        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('securityKey');
            router.navigate(['/auth/login']);
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
            //     router.navigate(['/auth/login']);
            // }
            return false;
        }
    } else {
        router.navigate(['/auth/login']);
        return true;
    }
};
