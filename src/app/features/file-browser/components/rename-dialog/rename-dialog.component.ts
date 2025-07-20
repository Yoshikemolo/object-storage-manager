import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileInfo } from '@core/services/storage.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-rename-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() file: FileInfo | null = null;
  @Output() renamed = new EventEmitter<string>();
  
  newName = '';

  ngOnChanges(): void {
    if (this.file) {
      this.newName = this.file.name;
    }
  }

  rename(): void {
    if (this.newName.trim() && this.file && this.newName !== this.file.name) {
      this.renamed.emit(this.newName);
      this.hideDialog();
    }
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.newName = '';
  }
}