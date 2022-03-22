import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, filter, finalize, take, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/shared/types';
import { AuthService } from '../../services';
import { AuthQuery } from '../../state';

type LoginFormValues = { username: string; password: string };

@Component({
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
})
export class LoginViewComponent implements OnInit {
  public isLoading = false;
  public formError: string | null = null;

  public form = this.fb.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    /* eslint-enable */
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly query: AuthQuery
  ) {}

  public ngOnInit(): void {
    this.query.isAuthenticated
      .pipe(
        take(1),
        filter((authenticated) => authenticated),
        tap(() => void this.router.navigate(['/']))
      )
      .subscribe();
  }

  public login() {
    if (!this.form.valid) return;

    const { username, password } = this.form.value as LoginFormValues;

    this.isLoading = true;
    this.formError = null;

    this.auth
      .login(username, password)
      .pipe(
        tap(() => void this.router.navigate(['/'])),
        catchError((errorResponse: ErrorResponse) => {
          if (
            errorResponse?.error?.non_field_errors?.[0] ===
            'Unable to log in with provided credentials.'
          ) {
            this.formError = 'Invalid username or password.';
          } else {
            this.formError = 'An unhandled error happened.';
          }

          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    return 'Unknown error.';
  }
}
