import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StrategyItem } from '../interfaces';

export function strategySum(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const totalSize = (control.value as StrategyItem[])
      .map((item) => item.size)
      .reduce((a, b) => a + b, 0);

    return totalSize === 100 ? null : { strategySum: true };
  };
}
