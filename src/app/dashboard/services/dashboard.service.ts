import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PortfolioIndicators, Strategy } from '../interfaces';
import { DashboardStore } from '../state';

type MyStrategy = { current: Strategy; target: Strategy };

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: DashboardStore
  ) {}

  public fetch(): void {
    this.store.setLoading(true);

    forkJoin({
      strategy: this.fetchMyStrategy(),
      indicators: this.fetchIndicators(),
    })
      .pipe(
        catchError((errorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  private fetchMyStrategy(): Observable<MyStrategy> {
    return this.http
      .get<MyStrategy>(`/dashboard/strategies/me`)
      .pipe(tap((me) => this.store.update({ me })));
  }

  private fetchIndicators(): Observable<PortfolioIndicators> {
    return this.http
      .get<PortfolioIndicators>(`/dashboard/portfolio-indicators`)
      .pipe(tap((indicators) => this.store.update({ indicators })));
  }
}
