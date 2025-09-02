import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { Router } from '@angular/router';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { User } from 'devextreme/ui/chat';
// import { AuthService } from '../../../core/auth/auth.service';
import { DxButtonModule } from 'devextreme-angular';
// import { ProfileViewerComponent } from '../profile-viewer/profile-viewer.component';
@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        DxToolbarModule,
        NgIf,
        ThemeSwitcherComponent,
        DxButtonModule,
        // ProfileViewerComponent,
    ],
})
export class HeaderComponent implements OnInit {
    @Output()
    menuToggle = new EventEmitter<boolean>();

    @Input()
    menuToggleEnabled = false;

    @Input()
    title!: string;

    user: any = {};

    constructor( private router: Router) {}

    ngOnInit() {
        // this.authService.user$.subscribe((user: any) => {
        //     this.user = user;
        // });
    }

    toggleMenu = () => {
        this.menuToggle.emit();
    };

    onLogout() {
        // this.authService.signOut().subscribe(
        //     () => {
        //         this.router.navigate(['/auth/login']);
        //     },
        //     (error: Error) => {
        //         console.error('Logout failed', error);
        //     }
        // );
    }
}
