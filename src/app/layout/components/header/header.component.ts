import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '@core/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MenubarModule,
    TooltipModule,
    RippleModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  
  menuItems: MenuItem[] = [];
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'File Browser',
        icon: 'pi pi-folder',
        routerLink: '/file-browser'
      },
      {
        label: 'Storage',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Browse Files',
            icon: 'pi pi-folder',
            routerLink: '/file-browser'
          },
          {
            label: 'Upload Files',
            icon: 'pi pi-upload',
            disabled: true // Temporalmente deshabilitado
          }
        ]
      },
      {
        label: 'Tools',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Search',
            icon: 'pi pi-search',
            disabled: true // Temporalmente deshabilitado
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            disabled: true // Temporalmente deshabilitado
          }
        ]
      }
    ];

    this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}