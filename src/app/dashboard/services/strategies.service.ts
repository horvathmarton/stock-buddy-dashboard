import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, pluck, tap } from 'rxjs/operators';
import { ApiPaginationResponse } from 'src/app/shared/types';
import { defaultCatchError } from 'src/app/shared/operators';
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

  public list(): void {
    this.store.setLoading(true);

    this.http
      .get<ApiPaginationResponse<Strategy>>(`/dashboard/strategies`)
      .pipe(
        pluck('results'),
        tap((strategies) => this.store.set(strategies)),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public create(strategy: Strategy): void {
    this.store.setLoading(true);

    this.http
      .post<Strategy>(`/dashboard/strategies`, strategy)
      .pipe(
        tap((strategy) => this.store.add(strategy)),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public select(strategy: Strategy): void {
    this.store.setLoading(true);

    this.http
      .post(`/dashboard/strategies/select-strategy`, {
        strategy: strategy.id,
      })
      .pipe(
        tap(() => this.fetchMyStrategy()),
        defaultCatchError(this.store)
      )
      .subscribe();
  }

  public fetchMyStrategy(): void {
    this.store.setLoading(true);

    this.http
      .get<MyStrategy>(`/dashboard/strategies/me`)
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
