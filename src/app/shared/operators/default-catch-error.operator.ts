import { Store } from '@datorama/akita';
import { EMPTY, MonoTypeOperatorFunction, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../types';

export function defaultCatchError<T, U>(
  store: Store<T>
): MonoTypeOperatorFunction<U> {
  return pipe(
    catchError((errorResponse: ErrorResponse) => {
      store.setError(errorResponse.error);

      return EMPTY;
    })
  );
}
