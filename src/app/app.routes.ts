import { Routes } from '@angular/router';
import {
    LoginFormComponent,
    ResetPasswordFormComponent,
    CreateAccountFormComponent,
    ChangePasswordFormComponent,
} from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { layout: false },
    },
    {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuardService],
        data: { layout: true },
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService],
        data: { layout: true },
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService],
        data: { layout: true },
    },
    {
        path: 'login-form',
        component: LoginFormComponent,
        canActivate: [AuthGuardService],
        data: { layout: false },
    },
    {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
        canActivate: [AuthGuardService],
        data: { layout: false },
    },
    {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuardService],
        data: { layout: false },
    },
    {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
        canActivate: [AuthGuardService],
        data: { layout: false },
    },
    {
        path: 'cds',
        canActivate: [AuthGuardService],
        data: { layout: true },
        loadChildren: () =>
            import('./features/cds/cds.routes').then(
                (m) => m.CDS_OPTION_ROUTES
            ),
    },
    {
        path: 'quick-monitor',
        canActivate: [AuthGuardService],
        data: { layout: true },
        loadChildren: () =>
            import('./features/quick-monitor/quick-monitor.routes').then(
                (m) => m.QUICK_MONITOR_ROUTES
            ),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
