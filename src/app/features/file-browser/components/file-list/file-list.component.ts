import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileInfo } from '@core/services/storage.service';
import { StorageService } from '@core/services/storage.service';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    MenuModule,
    CheckboxModule,
    TagModule,
    TooltipModule,
    SkeletonModule
  ],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent {
  @Input() files: FileInfo[] = [];
  @Input() loading = false;
  @Input() currentPath = '';
  @Output() navigate = new EventEmitter<string>();
  @Output() fileAction = new EventEmitter<{ type: string; file?: FileInfo }>();
  @Output() selectionChange = new EventEmitter<FileInfo[]>();
  
  @ViewChild('menu') menu!: Menu;
  
  selectedFiles: FileInfo[] = [];
  contextMenuItems: MenuItem[] = [];

  constructor(private storageService: StorageService) {}

  onRowSelect(event: any): void {
    const file: FileInfo = event.data;
    if (file.type === 'folder') {
      const newPath = file.path;
      this.navigate.emit(newPath);
    }
  }

  onContextMenu(file: FileInfo): void {
    this.contextMenuItems = [
      {
        label: 'Download',
        icon: 'pi pi-download',
        command: () => this.fileAction.emit({ type: 'download', file })
      },
      {
        label: 'Rename',
        icon: 'pi pi-pencil',
        command: () => this.fileAction.emit({ type: 'rename', file })
      },
      {
        separator: true
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.fileAction.emit({ type: 'delete', file })
      }
    ];
  }

  onSelectionChange(): void {
    this.selectionChange.emit(this.selectedFiles);
  }

  getFileIcon(file: FileInfo): string {
    if (file.type === 'folder') {
      return 'pi pi-folder text-blue-600';
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      // Documents
      case 'pdf':
        return 'pi pi-file-pdf text-red-600';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word text-blue-500';
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel text-green-600';
      case 'ppt':
      case 'pptx':
        return 'pi pi-file text-orange-500';
      case 'txt':
      case 'md':
      case 'readme':
        return 'pi pi-file-edit text-gray-600';
      
      // Images
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'pi pi-image text-purple-500';
      
      // Videos
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
      case 'webm':
      case 'flv':
        return 'pi pi-video text-indigo-600';
      
      // Audio
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return 'pi pi-volume-up text-green-500';
      
      // Archives
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return 'pi pi-file-archive text-yellow-600';
      
      // Code files
      case 'js':
      case 'ts':
        return 'pi pi-code text-yellow-500';
      case 'html':
      case 'htm':
        return 'pi pi-code text-orange-600';
      case 'css':
      case 'scss':
      case 'sass':
        return 'pi pi-code text-blue-400';
      case 'json':
        return 'pi pi-code text-green-400';
      case 'xml':
        return 'pi pi-code text-red-400';
      case 'py':
        return 'pi pi-code text-blue-600';
      case 'java':
        return 'pi pi-code text-red-500';
      case 'c':
      case 'cpp':
      case 'h':
        return 'pi pi-code text-purple-600';
      case 'php':
        return 'pi pi-code text-indigo-500';
      case 'sql':
        return 'pi pi-database text-orange-500';
      
      // Executables
      case 'exe':
      case 'msi':
      case 'dmg':
      case 'pkg':
      case 'deb':
      case 'rpm':
        return 'pi pi-cog text-gray-700';
      
      default:
        return 'pi pi-file text-gray-500';
    }
  }

  getFileTypeTag(file: FileInfo): string {
    if (file.type === 'folder') {
      return 'Folder';
    }
    const extension = file.name.split('.').pop()?.toUpperCase();
    return extension || 'File';
  }

  getFileTypeColor(file: FileInfo): string {
    if (file.type === 'folder') {
      return 'warning';
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'danger';
      case 'doc':
      case 'docx':
        return 'info';
      case 'xls':
      case 'xlsx':
        return 'success';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'help';
      case 'zip':
      case 'rar':
      case '7z':
        return 'secondary';
      default:
        return 'primary';
    }
  }

  formatFileSize(bytes: number): string {
    return this.storageService.formatFileSize(bytes);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}