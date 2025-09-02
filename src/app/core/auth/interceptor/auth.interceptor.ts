import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthUtils } from '../auth.utils';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const blotterClientVersion = environment.blotterClientVersion;

    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.securityKey) {
        newReq = req.clone({
            headers: req.headers
                // .set('Authorization', 'Bearer ' + authService.securityKey)
                .set(
                    'Authorization',
                    'Bearer ' + '6Dt6leCsTQsS0h8Y5h4zrdXoNAlgHTXvi23',
                )
                .set('BlotterClientVersion', blotterClientVersion)
                .set('Access-Control-Allow-Origin', '*'),
        });
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                // authService.signOut();
                localStorage.removeItem('securityKey');
                router.navigate(['/auth/login']);

                // Reload the app
                // location.reload();
            }

            return throwError(error);
        }),
    );
};
