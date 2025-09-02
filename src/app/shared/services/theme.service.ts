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
    'clay.light',
    'clay.dark',
    'sage.light',
    'sage.dark',
    'amberwood.light',
    'amberwood.dark',
    'storm.light',
    'storm.dark',
    'mulberry.light',
    'mulberry.dark',
    'tealstone.light',
    'tealstone.dark',
    'ochre.light',
    'ochre.dark',
    'slaterose.light',
    'slaterose.dark',
  ];

  // ✅ Theme-specific CSS variable overrides
  private readonly themeVariables: Record<
    string,
    Partial<Record<string, string>>
  > = {
    'clay.light': { '--text-color': '#000000' },
    'clay.dark': { '--text-color': '#ffffff' },
    'sage.light': { '--text-color': '#000000' },
    'sage.dark': { '--text-color': '#ffffff' },
    'amberwood.light': { '--text-color': '#000000' },
    'amberwood.dark': { '--text-color': '#ffffff' },
    'storm.light': { '--text-color': '#000000' },
    'storm.dark': { '--text-color': '#ffffff' },
    'mulberry.light': { '--text-color': '#000000' },
    'mulberry.dark': { '--text-color': '#ffffff' },
    'tealstone.light': { '--text-color': '#000000' },
    'tealstone.dark': { '--text-color': '#ffffff' },
    'ochre.light': { '--text-color': '#000000' },
    'ochre.dark': { '--text-color': '#ffffff' },
    'slaterose.light': { '--text-color': '#000000' },
    'slaterose.dark': { '--text-color': '#ffffff' },
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
