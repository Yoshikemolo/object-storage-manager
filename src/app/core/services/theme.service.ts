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
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    
    if (themeLink) {
      const themeName = theme === 'dark' ? 'lara-dark-blue' : 'lara-light-blue';
      themeLink.href = `node_modules/primeng/resources/themes/${themeName}/theme.css`;
    } else {
      // Create theme link if it doesn't exist
      const link = document.createElement('link');
      link.id = 'app-theme';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      const themeName = theme === 'dark' ? 'lara-dark-blue' : 'lara-light-blue';
      link.href = `node_modules/primeng/resources/themes/${themeName}/theme.css`;
      document.head.appendChild(link);
    }
  }
}