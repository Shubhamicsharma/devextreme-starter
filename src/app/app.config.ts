import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import {
    AppInfoService,
    AuthGuardService,
    AuthService,
    ScreenService,
} from './shared/services';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideAuth } from './core/auth/auth.provider';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withHashLocation()),
        AuthGuardService,
        AuthService,
        ScreenService,
        AppInfoService, provideHotToastConfig(),
        provideAuth(),
    ],
};
