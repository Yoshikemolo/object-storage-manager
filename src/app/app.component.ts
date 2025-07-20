import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { LayoutModule } from './layout/layout.module';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LayoutModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Storage Manager';

  constructor(
    private primeng: PrimeNG,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.themeService.init();
  }
}