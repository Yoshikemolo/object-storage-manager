import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '@core/services/storage.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

interface UploadEvent {
  files: File[];
}

@Component({
  selector: 'app-file-upload-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FileUploadModule,
    ProgressBarModule,
    ButtonModule
  ],
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() currentPath = '';
  @Output() uploadComplete = new EventEmitter<void>();
  
  uploadedFiles: File[] = [];
  uploading = false;
  uploadProgress = 0;

  constructor(
    private storageService: StorageService,
    private messageService: MessageService
  ) {}

  onUpload(event: UploadEvent): void {
    this.uploadedFiles = event.files;
    this.uploadFiles();
  }

  private async uploadFiles(): Promise<void> {
    if (this.uploadedFiles.length === 0) return;
    
    this.uploading = true;
    this.uploadProgress = 0;
    
    const totalFiles = this.uploadedFiles.length;
    let completedFiles = 0;
    
    for (const file of this.uploadedFiles) {
      try {
        await this.storageService.uploadFile(file, this.currentPath).toPromise();
        completedFiles++;
        this.uploadProgress = Math.round((completedFiles / totalFiles) * 100);
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: `Failed to upload ${file.name}`
        });
      }
    }
    
    this.uploading = false;
    
    if (completedFiles === totalFiles) {
      this.messageService.add({
        severity: 'success',
        summary: 'Upload Complete',
        detail: `Successfully uploaded ${completedFiles} file(s)`
      });
      this.uploadComplete.emit();
      this.close();
    }
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.uploadedFiles = [];
    this.uploadProgress = 0;
  }

  formatSize(bytes: number): string {
    return this.storageService.formatFileSize(bytes);
  }
}