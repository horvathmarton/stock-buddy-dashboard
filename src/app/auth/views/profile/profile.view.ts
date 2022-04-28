import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services';
import { PasswordChangeFormValues } from '../../types';
import { passwordConfirmMatch } from '../../validators';

@Component({
  templateUrl: './profile.view.html',
  styleUrls: ['./profile.view.scss'],
})
export class ProfileViewComponent {
  public formError: string | null = null;
  public message: string | null = null;

  public readonly form = this.builder.group(
    {
      /* eslint-disable @typescript-eslint/unbound-method */
      password: [null, Validators.required],
      passwordConfirmation: [null, Validators.required],
      /* eslint-enable */
    },
    { validators: [passwordConfirmMatch()] }
  );

  constructor(
    private readonly auth: AuthService,
    private readonly builder: FormBuilder
  ) {}

  public changePassword(): void {
    if (this.form.invalid) return;

    this.auth
      .changePassword((this.form.value as PasswordChangeFormValues).password)
      .pipe(
        tap(() => (this.message = 'Password changed successfully.')),
        catchError(() => {
          this.formError = 'An unhandled error happened.';

          return EMPTY;
        })
      )
      .subscribe();
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('passwordConfirmMatch')) {
      return "Password and confirmation doesn't match.";
    }

    /**
     * This happens when the group is valid, but the fields aren't.
     * In this case we don't want to display any error on the form level.
     */
    if (control.errors === null) {
      return '';
    }

    return 'Unknown error.';
  }
}
