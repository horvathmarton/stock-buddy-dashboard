import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DisposableComponent } from 'src/app/shared/components';

@Component({
  selector: 'sb-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent
  extends DisposableComponent
  implements AfterViewInit
{
  @Input()
  public toggleSidenav!: Observable<boolean | undefined>;

  @ViewChild(MatDrawer)
  public drawer!: MatDrawer;

  public ngAfterViewInit(): void {
    this.toggleSidenav
      .pipe(
        tap((isOpen) => void this.drawer.toggle(isOpen)),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }
}
