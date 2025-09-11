import { Routes } from '@angular/router';
import {
    LoginFormComponent,
    ResetPasswordFormComponent,
    CreateAccountFormComponent,
    ChangePasswordFormComponent,
} from './shared/components';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { NoAuthGuard } from './core/auth/guard/noAuth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { layout: false },
        canActivate: [NoAuthGuard]
    },
    {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuard],
        data: { layout: true },
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { layout: true },
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { layout: true },
    },
    {
        path: 'login-form',
        component: LoginFormComponent,
        canActivate: [AuthGuard],
        data: { layout: false },
    },
    {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
        canActivate: [AuthGuard],
        data: { layout: false },
    },
    {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuard],
        data: { layout: false },
    },
    {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
        canActivate: [AuthGuard],
        data: { layout: false },
    },
    {
        path: 'cds',
        canActivate: [AuthGuard],
        data: { layout: true },
        loadChildren: () =>
            import('./features/cds/cds.routes').then(
                (m) => m.CDS_OPTION_ROUTES
            ),
    },
    {
        path: 'quick-monitor',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: { layout: true },
        loadChildren: () =>
            import('./features/quick-monitor/quick-monitor.routes').then(
                (m) => m.QUICK_MONITOR_ROUTES
            ),
    },
    {
        path: '**',
        redirectTo: 'quick-monitor',
    },
];
