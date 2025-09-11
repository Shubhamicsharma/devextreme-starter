import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import themes from 'devextreme/ui/themes';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'app-theme';

  // ✅ List of available themes
  readonly allThemes = [
    'emerald-depths.light',
    'emerald-depths.dark',
    'indigo-night.light',
    'indigo-night.dark',
    'sunset-ember.light',
    'sunset-ember.dark',
    'royal-amethyst.light',
    'royal-amethyst.dark',
    'crimson-flame.light',
    'crimson-flame.dark',
    'amber-glow.light',
    'amber-glow.dark',
    'teal-abyss.light',
    'teal-abyss.dark',
    'coral-blush.light',
    'coral-blush.dark',
  ];

  // ✅ Theme-specific CSS variable overrides
  private readonly themeVariables: Record<
    string,
    Partial<Record<string, string>>
  > = {
    'indigo-night.light': { '--text-color': '#000000' },
    'indigo-night.dark': { '--text-color': '#ffffff' },
    'sunset-ember.light': { '--text-color': '#000000' },
    'sunset-ember.dark': { '--text-color': '#ffffff' },
    'emerald-depths.light': { '--text-color': '#000000' },
    'emerald-depths.dark': { '--text-color': '#ffffff' },
    'royal-amethyst.light': { '--text-color': '#000000' },
    'royal-amethyst.dark': { '--text-color': '#ffffff' },
    'crimson-flame.light': { '--text-color': '#000000' },
    'crimson-flame.dark': { '--text-color': '#ffffff' },
    'amber-glow.light': { '--text-color': '#000000' },
    'amber-glow.dark': { '--text-color': '#ffffff' },
    'teal-abyss.light': { '--text-color': '#000000' },
    'teal-abyss.dark': { '--text-color': '#ffffff' },
    'coral-blush.light': { '--text-color': '#000000' },
    'coral-blush.dark': { '--text-color': '#ffffff' },
  };

  currentTheme: string;
  isDark = new BehaviorSubject<boolean>(false);
  currentTheme$: BehaviorSubject<string>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    let savedTheme = localStorage.getItem(this.storageKey);

    // ✅ fallback to first theme in list
    if (!savedTheme || !this.allThemes.includes(savedTheme)) {
      savedTheme = this.allThemes[0];
      localStorage.setItem(this.storageKey, savedTheme);
    }

    this.currentTheme = savedTheme;
    this.currentTheme$ = new BehaviorSubject<string>(this.currentTheme);

    themes.current(this.currentTheme);
    this.applySwatchTheme(this.currentTheme);
  }

  applySwatchTheme(theme: string, prevTheme: string = '') {
    const body = this.document.body;
    const root = this.document.documentElement;
    const isDarkTheme = theme.includes('dark');

    // Default text color
    root.style.setProperty('--text-color', isDarkTheme ? '#ffffff' : '#000000');

    // Remove old theme classes
    this.allThemes.forEach(t => body.classList.remove(t.replace(/\./g, '-')));

    // Remove old theme if passed
    if (prevTheme) {
      body.classList.remove(prevTheme.replace(/\./g, '-'));
    }

    // Add new theme class
    body.classList.add(theme.replace(/\./g, '-'));

    // Apply custom variables
    const vars = this.themeVariables[theme] || {};
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value ?? '');
    }

    // DevExtreme swatch classes
    if (isDarkTheme) {
      body.classList.remove('dx-swatch-light');
      body.classList.add('dx-swatch-dark');
      this.isDark.next(true);
    } else {
      body.classList.remove('dx-swatch-dark');
      body.classList.add('dx-swatch-light');
      this.isDark.next(false);
    }
  }

  switchTo(theme: string) {
    if (!this.allThemes.includes(theme)) return;

    try {
      const prevTheme = this.currentTheme;
      console.log(`Switching theme from ${prevTheme} to ${theme}`);
      themes.current(theme);
      this.applySwatchTheme(theme, prevTheme);
      this.currentTheme = theme;
      this.currentTheme$.next(theme);
      localStorage.setItem(this.storageKey, theme);
    } catch (err) {
      console.error('Failed to apply theme:', theme, err);
    }
  }

  switchToNextTheme() {
    const idx = this.allThemes.indexOf(this.currentTheme);
    const nextIdx = (idx + 1) % this.allThemes.length;
    this.switchTo(this.allThemes[nextIdx]);
  }
}
