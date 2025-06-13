import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-drawer-content',
  standalone: true,
  imports: [DrawerModule, ButtonModule],
  templateUrl: './drawer-content.component.html',
  styleUrl: './drawer-content.component.scss',
})
export class DrawerContentComponent implements OnInit {
  public Visible: boolean = false;

  @Input()
  public DrawerOpenEvent = new EventEmitter<any>();

  public OpenDrawer() {
    this.Visible = true;
  }

  public ngOnInit(): void {
    this.DrawerOpenEvent.subscribe(() => this.OpenDrawer());
  }
}
