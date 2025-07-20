import { Routes } from '@angular/router';
import { FileBrowserComponent } from './features/file-browser/file-browser.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/file-browser',
    pathMatch: 'full'
  },
  {
    path: 'file-browser',
    component: FileBrowserComponent
  },
  {
    path: '**',
    redirectTo: '/file-browser'
  }
];