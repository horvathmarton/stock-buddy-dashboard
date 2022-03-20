import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services';

@Component({
  selector: 'sb-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnDestroy {
  @Input()
  public toggleSidenav!: Subject<boolean>;

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  public logout(): void {
    this.auth.logout();

    this.router.navigate(['/auth/login']);
  }

  public ngOnDestroy() {
    this.toggleSidenav.next(false);
  }
}
