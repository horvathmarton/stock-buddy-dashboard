import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PasswordChangeFormValues } from '../types';

export function passwordConfirmMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { password, passwordConfirmation } =
      control.value as PasswordChangeFormValues;

    return password === passwordConfirmation
      ? null
      : { passwordConfirmMatch: true };
  };
}
