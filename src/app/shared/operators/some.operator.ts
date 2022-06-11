import { map, Observable, pipe, UnaryFunction } from 'rxjs';

export function some(): UnaryFunction<
  Observable<boolean[]>,
  Observable<boolean>
> {
  return pipe(map((booleans: boolean[]) => booleans.some((bool) => bool)));
}
