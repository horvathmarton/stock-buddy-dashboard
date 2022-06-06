import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { CashBalance } from '../interfaces';
import { CashState, CashStore } from './cash.store';

@Injectable({ providedIn: 'root' })
export class CashQuery extends QueryEntity<CashState> {
  public total = this.select('total');

  constructor(protected store: CashStore) {
    super(store);
  }

  public portfolioBalance(id: number): Observable<CashBalance | undefined> {
    return this.selectEntity(id);
  }
}
