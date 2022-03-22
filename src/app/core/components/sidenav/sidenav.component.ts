import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'sb-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements AfterViewInit, OnDestroy {
  private onDestroy = new Subject<boolean>();

  @Input()
  public toggleSidenav!: Observable<boolean>;

  @ViewChild(MatDrawer)
  public drawer!: MatDrawer;

  public ngAfterViewInit(): void {
    this.toggleSidenav
      .pipe(
        tap(() => void this.drawer.toggle()),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
