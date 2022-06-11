import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { finalize, tap } from 'rxjs';
import { defaultCatchError } from 'src/app/shared/operators';
import { CashBalance } from '../interfaces';
import { CashStore } from '../state';

@Injectable({ providedIn: 'root' })
export class CashService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: CashStore
  ) {}

  public fetch(
    id: number | 'summary' = 'summary',
    asOf: Date = new Date()
  ): void {
    this.store.setLoading(true);

    this.http
      .get<CashBalance>(`/cash/${id}?as_of=${format(asOf, 'yyyy-MM-dd')}`)
      .pipe(
        tap((balance) => {
          if (id === 'summary') {
            this.store.update({ total: balance });
          } else {
            this.store.upsert(id, balance);
          }
        }),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
