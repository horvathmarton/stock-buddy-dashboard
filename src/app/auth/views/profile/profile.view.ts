import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services';
import { AuthService } from '../../services';
import { passwordConfirmMatch } from '../../validators';
import packageInfo from '../../../../../package.json';

@Component({
  templateUrl: './profile.view.html',
  styleUrls: ['./profile.view.scss'],
})
export class ProfileViewComponent {
  public formError: string | null = null;
  public message: string | null = null;

  public readonly serverVersion = this.coreService.version();
  public readonly dashboardVersion = {
    version: packageInfo.version,
    commit: packageInfo.commit,
  };

  public readonly form = this.builder.nonNullable.group(
    {
      password: new FormControl<string | null>(null, Validators.required),
      passwordConfirmation: new FormControl<string | null>(null, Validators.required),
    },
    { validators: [passwordConfirmMatch()] }
  );

  constructor(
    private readonly auth: AuthService,
    private readonly builder: FormBuilder,
    private readonly coreService: CoreService
  ) { }

  public changePassword(): void {
    const { password } = this.form.value;

    if (this.form.invalid || !password) return;

    this.auth
      .changePassword(password)
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

    if (control.hasError('required')) return 'This field is required.';

    if (control.hasError('passwordConfirmMatch')) return "Password and confirmation doesn't match.";

    /**
     * This happens when the group is valid, but the fields aren't.
     * In this case we don't want to display any error on the form level.
     */
    if (control.errors === null) return '';

    return 'Unknown error.';
  }
}
