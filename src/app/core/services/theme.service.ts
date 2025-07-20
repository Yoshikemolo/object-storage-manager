import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DEFAULT_THEME: Theme = 'light';
  
  private currentThemeSubject = new BehaviorSubject<Theme>(this.DEFAULT_THEME);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {}

  init(): void {
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme);
  }

  setTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentThemeSubject.next(theme);
    this.saveTheme(theme);
    this.updatePrimeNGTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  private getSavedTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    return savedTheme || this.DEFAULT_THEME;
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private updatePrimeNGTheme(theme: Theme): void {
    // PrimeNG v19 themes are handled via CSS variables in styles.scss
    // No need to load external CSS files
    console.log(`Theme switched to: ${theme}`);
  }
}