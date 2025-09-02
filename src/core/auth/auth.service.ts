import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from './auth.utils';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { RVHttpService } from '../services/http.service';

export interface Credentials {
    username: string;
    password: string;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private httpService = inject(RVHttpService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set securityKey(token: string) {
        localStorage.setItem('securityKey', token);
    }

    get securityKey(): string {
        return localStorage.getItem('securityKey') ?? '';
    }

    get userData(): any {
        return JSON.parse(localStorage.getItem('userData') ?? '{}');
    }

    set userData(user: any) {
        localStorage.setItem('userData', JSON.stringify(user));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Login Service
     * @param credentials
     * set the access token in the local storage
     */

    login(credentials: Credentials): Observable<any> {
        return this.httpService.login(credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.securityKey = response.Model.Token;
                // Store the user data in the local storage
                this.userData = response.Model.User;

                // Return a new observable with the response
                return of(response);
            }),
        );
    }

    // /**
    //  * Sign out
    //  */
    signOut(): Observable<any> {
        //     // Remove the access token from the local storage
        localStorage.removeItem('securityKey');

        // Return the observable
        return of(true);
    }
}
