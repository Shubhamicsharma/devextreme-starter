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
      { name: 'Indigo Night 🌌', key: 'indigo-night', rgba: 'rgba(75, 61, 191, 1)' },      // Light: #4B3DBF
      { name: 'Sunset Ember 🌅', key: 'sunset-ember', rgba: 'rgba(255, 112, 67, 1)' },     // Light: #FF7043
      { name: 'Emerald Depths 🍃', key: 'emerald-depths', rgba: 'rgba(52, 199, 89, 1)' },  // Light: #34C759
      { name: 'Royal Amethyst 👑', key: 'royal-amethyst', rgba: 'rgba(155, 81, 224, 1)' }, // Light: #9B51E0
      { name: 'Crimson Flame 🔴', key: 'crimson-flame', rgba: 'rgba(235, 87, 87, 1)' },    // Light: #EB5757
      { name: 'Amber Glow 🌟', key: 'amber-glow', rgba: 'rgba(242, 201, 76, 1)' },         // Light: #F2C94C
      { name: 'Teal Abyss 🌀', key: 'teal-abyss', rgba: 'rgba(45, 156, 219, 1)' },         // Light: #2D9CDB
      { name: 'Coral Blush 🌸', key: 'coral-blush', rgba: 'rgba(255, 111, 145, 1)' },      // Light: #FF6F91
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
