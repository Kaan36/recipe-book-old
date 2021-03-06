import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START)
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC9h6sLGDJQgYNtpRpgbbpAcogu7dnbDkM',
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    map(resData => {
                        const expirationDate = new Date(
                            new Date().getTime() + +resData.expiresIn * 1000
                        );
                        return new AuthActions.AuthenticateSuccess({
                            email: resData.email,
                            userId: resData.localId,
                            token: resData.idToken,
                            expirationDate: expirationDate
                        });
                    }),
                    catchError(errorRes => {
                        let errorMessage = 'An unknown error occurred!';
                        if (!errorRes.error || !errorRes.error.error) {
                            return of(new AuthActions.AuthenticateFail(errorMessage));
                        }
                        switch (errorRes.error.error.message) {
                            case 'EMAIL_EXISTS':
                                errorMessage = 'This email exists already';
                                break;
                            case 'EMAIL_NOT_FOUND':
                                errorMessage = 'This email does not exist.';
                                break;
                            case 'INVALID_PASSWORD':
                                errorMessage = 'This password is not correct.'
                                break;
                        }
                        return of(new AuthActions.AuthenticateFail(errorMessage));
                    }),
                );
        }),
    );

    @Effect({ dispatch: false })
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) { }
}