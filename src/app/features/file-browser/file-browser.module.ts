import { NgModule } from '@angular/core';

// Services
import { ConfirmationService, MessageService } from 'primeng/api';

// Components
import { FileBrowserComponent } from './file-browser.component';

@NgModule({
  imports: [
    FileBrowserComponent
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class FileBrowserModule { }