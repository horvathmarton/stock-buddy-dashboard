import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const number = Number.parseFloat(control.value as string);

    return Number.isInteger(number) ? null : { nonInteger: true };
  };
}
