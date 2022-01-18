import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/auth/state';
import { CoreQuery } from '../../state';

@Component({
  selector: 'app-root',
  templateUrl: './app.view.html',
  styleUrls: ['./app.view.scss'],
})
export class AppViewComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<boolean>();

  public readonly toggleSidenav = new Subject<boolean>();

  @HostBinding('class')
  public theme!: string;

  constructor(
    private readonly coreQuery: CoreQuery,
    public readonly authQuery: AuthQuery
  ) {}

  public ngOnInit(): void {
    this.coreQuery.isDark
      .pipe(
        map((isDark) => (isDark ? 'dark-mode' : 'light-mode')),
        tap((mode) => (this.theme = `mat-app-background ${mode}`))
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
