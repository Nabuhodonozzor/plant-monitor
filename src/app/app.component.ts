import { Component } from '@angular/core';
import { DrawerContentComponent } from './components/drawer-content/drawer-content.component';
import { AppContentComponent } from './components/app-content/app-content.component';
import { ButtonDirective } from 'primeng/button';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [DrawerContentComponent, AppContentComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'plant-monitor-front';
}
