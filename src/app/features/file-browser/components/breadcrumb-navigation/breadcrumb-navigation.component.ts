import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-navigation',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule
  ],
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss']
})
export class BreadcrumbNavigationComponent implements OnChanges {
  @Input() currentPath = '';
  @Output() navigate = new EventEmitter<string>();
  
  items: MenuItem[] = [];
  home: MenuItem = {
    icon: 'pi pi-home',
    command: () => this.navigate.emit('')
  };

  ngOnChanges(): void {
    this.updateBreadcrumb();
  }

  private updateBreadcrumb(): void {
    this.items = [];
    
    if (!this.currentPath) {
      return;
    }
    
    const parts = this.currentPath.split('/').filter(p => p);
    let path = '';
    
    parts.forEach((part, index) => {
      path += (index > 0 ? '/' : '') + part;
      const currentPath = path;
      
      this.items.push({
        label: part,
        command: () => this.navigate.emit(currentPath)
      });
    });
  }
}