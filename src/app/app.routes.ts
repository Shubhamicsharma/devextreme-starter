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
import { CDSOptionsComponent } from './features/cds/cdsOptions/cds-options.component';

export const routes: Routes = [
    {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'login-form',
        component: LoginFormComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'cds',
        canActivate: [AuthGuardService],
        loadChildren: () =>
            import('./features/cds/cds.routes').then(
                (m) => m.CDS_OPTION_ROUTES
            ),
    },
    {
      path: 'quick-monitor',
      canActivate: [AuthGuardService],
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
