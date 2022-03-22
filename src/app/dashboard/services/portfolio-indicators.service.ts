import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/shared/types';
import { PortfolioIndicators } from '../interfaces';
import { PortfolioIndicatorsStore } from '../state';

@Injectable({ providedIn: 'root' })
export class PortfolioIndicatorsService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: PortfolioIndicatorsStore
  ) {}

  public fetch(): void {
    this.store.setLoading(true);

    this.http
      .get<PortfolioIndicators>(`/dashboard/portfolio-indicators`)
      .pipe(
        tap((indicators) => void this.store.update({ indicators })),
        catchError((errorResponse: ErrorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
