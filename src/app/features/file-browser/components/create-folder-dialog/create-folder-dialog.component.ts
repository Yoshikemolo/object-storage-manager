import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-folder-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.scss']
})
export class CreateFolderDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() currentPath = '';
  @Output() folderCreated = new EventEmitter<string>();
  
  folderName = '';

  createFolder(): void {
    if (this.folderName.trim()) {
      this.folderCreated.emit(this.folderName);
      this.folderName = '';
      this.visible = false;
      this.visibleChange.emit(false);
    }
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.folderName = '';
  }
}