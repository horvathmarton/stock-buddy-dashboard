import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { PortfolioIndicators } from '../interfaces';
import { PortfolioIndicatorsStore } from '../state';
import { defaultCatchError } from '../../shared/operators';

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
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
