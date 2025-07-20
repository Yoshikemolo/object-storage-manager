import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { StorageService } from '@core/services/storage.service';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    MenuModule,
    BadgeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  menuItems: MenuItem[] = [];
  storageInfo: any = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Navigation',
        items: [
          {
            label: 'File Browser',
            icon: 'pi pi-folder-open',
            routerLink: '/file-browser',
            command: () => this.closeSidebar()
          },
          {
            label: 'Upload Files',
            icon: 'pi pi-upload',
            routerLink: '/upload',
            command: () => this.closeSidebar()
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
            routerLink: '/search',
            command: () => this.closeSidebar()
          }
        ]
      },
      {
        label: 'Actions',
        items: [
          {
            label: 'Test Connection',
            icon: 'pi pi-sync',
            command: () => {
              this.testConnection();
              this.closeSidebar();
            }
          },
          {
            label: 'Refresh',
            icon: 'pi pi-refresh',
            command: () => {
              window.location.reload();
              this.closeSidebar();
            }
          }
        ]
      }
    ];

    // Test connection on init - Comentado temporalmente hasta que el backend esté disponible
    // this.testConnection();
  }

  closeSidebar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  testConnection(): void {
    this.storageService.testMinioConnection().subscribe({
      next: (response) => {
        this.storageInfo = response;
      },
      error: (error) => {
        console.error('Connection test failed:', error);
      }
    });
  }
}