import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../../services';

@Component({
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
})
export class LoginViewComponent implements OnInit {
  public isLoading = false;
  public formError: string | null = null;

  public form = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    if (this.auth.authenticated) {
      this.router.navigate(['/']);
    }
  }

  public login() {
    if (!this.form.valid) return;

    const { username, password } = this.form.value;

    this.isLoading = true;
    this.formError = null;

    this.auth
      .login(username, password)
      .pipe(
        tap(() => this.router.navigate(['/'])),
        catchError((errorResponse) => {
          if (
            errorResponse?.error?.non_field_errors?.[0] ===
            'Unable to log in with provided credentials.'
          ) {
            this.formError = 'Invalid username or password.';
          } else {
            this.formError = errorResponse?.error;
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
