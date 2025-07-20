import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService, FileInfo } from '@core/services/storage.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Import child components
import { BreadcrumbNavigationComponent } from './components/breadcrumb-navigation/breadcrumb-navigation.component';
import { FileActionsComponent } from './components/file-actions/file-actions.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { FileUploadDialogComponent } from './components/file-upload-dialog/file-upload-dialog.component';
import { CreateFolderDialogComponent } from './components/create-folder-dialog/create-folder-dialog.component';
import { RenameDialogComponent } from './components/rename-dialog/rename-dialog.component';

@Component({
  selector: 'app-file-browser',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    BreadcrumbNavigationComponent,
    FileActionsComponent,
    FileListComponent,
    FileUploadDialogComponent,
    CreateFolderDialogComponent,
    RenameDialogComponent
  ],
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss']
})
export class FileBrowserComponent implements OnInit {
  files: FileInfo[] = [];
  loading = false;
  currentPath = '';
  selectedFiles: FileInfo[] = [];
  
  uploadDialogVisible = false;
  createFolderDialogVisible = false;
  renameDialogVisible = false;
  
  fileToRename: FileInfo | null = null;

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(path: string = ''): void {
    this.loading = true;
    this.currentPath = path;
    
    this.storageService.listFiles(path).subscribe({
      next: (files) => {
        this.files = files.sort((a, b) => {
          // Folders first, then files
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }
          // Then alphabetically
          return a.name.localeCompare(b.name);
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load files'
        });
      }
    });
  }

  onNavigate(path: string): void {
    this.selectedFiles = [];
    this.loadFiles(path);
  }

  onFileAction(action: { type: string; file?: FileInfo }): void {
    switch (action.type) {
      case 'download':
        if (action.file) {
          this.downloadFile(action.file);
        }
        break;
      case 'rename':
        if (action.file) {
          this.showRenameDialog(action.file);
        }
        break;
      case 'delete':
        if (action.file) {
          this.confirmDelete(action.file);
        }
        break;
      case 'refresh':
        this.loadFiles(this.currentPath);
        break;
    }
  }

  downloadFile(file: FileInfo): void {
    if (file.type === 'folder') {
      this.storageService.downloadAsZip(file.path).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${file.name}.zip`;
          link.click();
          window.URL.revokeObjectURL(url);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Downloaded ${file.name}.zip`
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to download folder'
          });
        }
      });
    } else {
      this.storageService.downloadFileWithName(file.path);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Downloaded ${file.name}`
      });
    }
  }

  showRenameDialog(file: FileInfo): void {
    this.fileToRename = file;
    this.renameDialogVisible = true;
  }

  confirmDelete(file: FileInfo): void {
    const message = file.type === 'folder' 
      ? `Are you sure you want to delete the folder "${file.name}" and all its contents?`
      : `Are you sure you want to delete the file "${file.name}"?`;
    
    this.confirmationService.confirm({
      message,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFile(file);
      }
    });
  }

  deleteFile(file: FileInfo): void {
    this.storageService.deleteFile(file.path).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Deleted ${file.name}`
        });
        this.loadFiles(this.currentPath);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete file'
        });
      }
    });
  }

  onUploadComplete(): void {
    this.uploadDialogVisible = false;
    this.loadFiles(this.currentPath);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Files uploaded successfully'
    });
  }

  onFolderCreated(folderName: string): void {
    this.createFolderDialogVisible = false;
    this.loadFiles(this.currentPath);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Folder "${folderName}" created`
    });
  }

  onFileRenamed(newName: string): void {
    this.renameDialogVisible = false;
    this.fileToRename = null;
    this.loadFiles(this.currentPath);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Renamed to "${newName}"`
    });
  }

  onSelectionChange(selectedFiles: FileInfo[]): void {
    this.selectedFiles = selectedFiles;
    this.cdr.detectChanges(); // Ensure view updates with new selection
  }

  deleteSelected(): void {
    if (this.selectedFiles.length === 0) return;
    
    const message = this.selectedFiles.length === 1
      ? `Are you sure you want to delete "${this.selectedFiles[0].name}"?`
      : `Are you sure you want to delete ${this.selectedFiles.length} items?`;
    
    this.confirmationService.confirm({
      message,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedFiles.map(file => 
          this.storageService.deleteFile(file.path).toPromise()
        );
        
        Promise.all(deletePromises).then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Deleted ${this.selectedFiles.length} items`
          });
          this.selectedFiles = [];
          this.loadFiles(this.currentPath);
        }).catch(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete some files'
          });
        });
      }
    });
  }

  downloadSelected(): void {
    this.selectedFiles.forEach(file => {
      this.downloadFile(file);
    });
  }
}