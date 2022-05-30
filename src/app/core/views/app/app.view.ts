import { Component, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services';
import { AuthQuery } from 'src/app/auth/state';
import { DisposableComponent } from 'src/app/shared/components';
import { CoreQuery } from '../../state';

@Component({
  selector: 'app-root',
  templateUrl: './app.view.html',
  styleUrls: ['./app.view.scss'],
})
export class AppViewComponent extends DisposableComponent implements OnInit {
  public readonly toggleSidenav = new Subject<boolean | undefined>();

  @HostBinding('class')
  public theme!: string;

  constructor(
    private readonly coreQuery: CoreQuery,
    public readonly authQuery: AuthQuery,
    public readonly authService: AuthService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.coreQuery.isDark
      .pipe(
        map((isDark) => (isDark ? 'dark-mode' : 'light-mode')),
        tap((mode) => (this.theme = `mat-app-background ${mode}`))
      )
      .subscribe();

    /**
     * Currently we only do this on application start.
     *
     * An access token is valid for a day and a refresh token is valid for a month,
     * so it shouldn't be an issue most of the time. In the special case when the
     * browser is open for more than a day we will log out the user on the next request.
     */
    this.authService.refreshTokens().subscribe();
  }
}
