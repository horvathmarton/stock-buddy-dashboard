import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordConfirmMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { password, passwordConfirmation } = control.value;

    return password === passwordConfirmation
      ? null
      : { passwordConfirmMatch: true };
  };
}
