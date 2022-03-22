import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/shared/types';
import { Strategy } from '../interfaces';
import { StrategiesStore } from '../state';

type MyStrategy = { current: Strategy; target: Strategy };

@Injectable({
  providedIn: 'root',
})
export class StrategiesService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: StrategiesStore
  ) {}

  public fetchMyStrategy(): void {
    this.store.setLoading(true);

    this.http
      .get<MyStrategy>(`/dashboard/strategies/me/`)
      .pipe(
        tap((me) => void this.store.update({ me })),
        catchError((errorResponse: ErrorResponse) => {
          if (errorResponse.status === 404) {
            this.store.update({ me: null });
          } else {
            this.store.setError(errorResponse.error);
          }

          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
