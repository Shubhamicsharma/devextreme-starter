import { Component, inject } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular';

@Component({
    selector: 'app-profile-viewer',
    standalone: true,
    imports: [FontAwesomeModule, CommonModule, DxButtonModule],
    templateUrl: './profile-viewer.component.html',
    styleUrl: './profile-viewer.component.scss',
})
export class ProfileViewerComponent {
    authService = inject(AuthService);
    faUser = faUser;

    showDropdown = false;
    user: any = null;

    constructor() {
        this.authService.loadUser().subscribe({
            next: (res: any) => {
                console.log('Loaded user:', res);

                this.user = {
                    DisplayName: res?.User?.Name || 'User',
                    Email: res?.User?.Email || '',
                    Role: res?.User?.Roles[0]?.Name || 'Admin', // fallback to Admin
                };
            },
            error: () => {
                this.user = {
                    DisplayName: 'User',
                    Email: '',
                    Role: 'Admin',
                };
            },
        });
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    signOut() {
        this.authService.signOut().subscribe();
        this.showDropdown = false;
    }

    // Close dropdown when clicking outside
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative.inline-block.text-left')) {
            this.showDropdown = false;
        }
    }

    getRoleBadgeClass(role: string): string {
        const roleBadgeClasses: { [key: string]: string } = {
            TRADER: 'inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20',
            RISK: 'inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-400/20',
            VERIFICATION:
                'inline-flex items-center rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 inset-ring inset-ring-yellow-400/20',
            ADMIN: 'inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20',
        };
        return roleBadgeClasses[role] || '';
    }
}
