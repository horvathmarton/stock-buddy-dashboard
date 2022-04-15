import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StockQuery } from 'src/app/stocks/state';

export function tickerExistsValidator(query: StockQuery): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return query.tickerExists(control.value as string).pipe(
      take(1),
      map((exists) => (exists ? null : { tickerNotExist: true }))
    );
  };
}
