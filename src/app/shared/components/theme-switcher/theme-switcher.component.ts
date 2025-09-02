import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface ThemeColor {
    name: string;
    key: string;
    rgba: string;
}

@Component({
    selector: 'theme-switcher',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './theme-switcher.component.html',
    styleUrls: ['./theme-switcher.component.css'],
})
export class ThemeSwitcherComponent implements OnInit {
    themeService = inject(ThemeService);

    showDropdown = false;

    // Icon for the theme switcher
    faPalette = faPalette;

    colors: ThemeColor[] = [
        { name: 'Clay', key: 'clay', rgba: 'rgba(203, 128, 97, 1)' },
        { name: 'Sage', key: 'sage', rgba: 'rgba(134, 168, 143, 1)' },
        { name: 'Amberwood', key: 'amberwood', rgba: 'rgba(201, 151, 90, 1)' },
        { name: 'Storm', key: 'storm', rgba: 'rgba(112, 128, 144, 1)' },
        { name: 'Mulberry', key: 'mulberry', rgba: 'rgba(154, 101, 139, 1)' },
        { name: 'Tealstone', key: 'tealstone', rgba: 'rgba(85, 139, 123, 1)' },
        { name: 'Ochre', key: 'ochre', rgba: 'rgba(191, 134, 66, 1)' },
        {
            name: 'Slate Rose',
            key: 'slaterose',
            rgba: 'rgba(146, 120, 130, 1)',
        },
    ];

    selectedColor = 'sage';
    selectedMode = 'light'; // light or dark

    ngOnInit(): void {
        const theme = this.themeService.currentTheme;
        this.extractThemeParts(theme);
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    closeDropdown() {
        this.showDropdown = false;
    }

    selectColor(colorKey: string) {
        this.selectedColor = colorKey;
        this.applyTheme();
    }

    selectMode(mode: string) {
        this.selectedMode = mode;
        this.applyTheme();
    }

    applyTheme() {
        const themeString = `${this.selectedColor}.${this.selectedMode}`;
        this.themeService.switchTo(themeString);
    }

    private extractThemeParts(theme: string) {
        // e.g. clay.light or sage.dark
        const parts = theme.split('.');
        this.selectedColor = parts[0];
        this.selectedMode = parts[1] || 'light';
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.theme-switcher-container')) {
            this.closeDropdown();
        }
    }
}
