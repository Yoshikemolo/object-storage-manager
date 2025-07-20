import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInfo } from '@core/services/storage.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-file-actions',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    TooltipModule
  ],
  templateUrl: './file-actions.component.html',
  styleUrls: ['./file-actions.component.scss']
})
export class FileActionsComponent {
  @Input() selectedFiles: FileInfo[] = [];
  @Input() currentPath = '';
  @Output() upload = new EventEmitter<void>();
  @Output() createFolder = new EventEmitter<void>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Output() downloadSelected = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
}