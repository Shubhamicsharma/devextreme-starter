import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from './auth.utils';
import {
    BehaviorSubject,
    catchError,
    Observable,
    of,
    switchMap,
    throwError,
} from 'rxjs';
import { RVHttpService } from '../services/http.service';
import { Router } from '@angular/router';

export interface Credentials {
    username: string;
    password: string;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private httpService = inject(RVHttpService);
    private router = inject(Router);

    private _user$ = new BehaviorSubject<any>(null);
    public user$ = this._user$.asObservable();

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

    loadUser(): Observable<any> {
        const currentUser = this._user$.getValue();
        if (currentUser) {
            return of({
                User: currentUser,
            });
        }

        // Fetch user details from local storage
        const user = this.userData;
        if (user && Object.keys(user).length > 0) {
            // If user data is found, update the user observable
            this._user$.next(user);
            return of({
                User: user,
            });
        }

        // If no user is found, return null
        this._user$.next(null);
        return of({
            User: null,
        });
    }

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
                console.log('Token:', this.securityKey);
                // Store the user data in the local storage
                this.userData = response.Model.User;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    // /**
    //  * Sign out
    //  */
    // signOut(): Observable<any> {
    //     //     // Remove the access token from the local storage
    //     localStorage.removeItem('securityKey');

    //     // Return the observable
    //     return of(true);
    // }

    signOut(): Observable<any> {
        // Clear user data
        this._user$.next(null);
        // Clear access token
        localStorage.removeItem('securityKey');
        this.router.navigate(['/login']);

        // Return the observable
        return of(true);
    }
}
