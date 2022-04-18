import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueItem(propertyName = 'name'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const items = control.value as Record<string, unknown>[];
    const ids = items.map((item) => item[propertyName]);
    const uniques = [...new Set(ids)];

    return ids.length === uniques.length ? null : { nonUniqueItems: true };
  };
}
