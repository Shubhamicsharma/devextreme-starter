import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    RouterModule,
    RouterOutlet,
    ActivatedRoute,
    NavigationEnd,
    Router,
} from '@angular/router';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { DxHttpModule } from 'devextreme-angular/http';
import { UnauthenticatedContentComponent } from './unauthenticated-content';
import { SideNavOuterToolbarComponent as SideNavToolbarComponent } from './layouts';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        RouterOutlet,
        CommonModule,
        DxHttpModule,
        SideNavToolbarComponent,
    ],
    providers: [],
})
export class AppComponent {
    @HostBinding('class') get getClass() {
        const sizeClassName = Object.keys(this.screen.sizes)
            .filter((cl) => this.screen.sizes[cl])
            .join(' ');
        return `${sizeClassName} app`;
    }

    showLayout = true;

    constructor(
        private authService: AuthService,
        private screen: ScreenService,
        public appInfo: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => {
                    let child = this.activatedRoute.firstChild;
                    while (child?.firstChild) {
                        child = child.firstChild;
                    }
                    return child?.snapshot.data['layout'];
                })
            )
            .subscribe((layout: boolean) => {
                this.showLayout = layout !== false;
            });
    }

    isAuthenticated() {
        return this.authService.loggedIn;
    }
}
