import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DashboardState, DashboardStore } from './dashboard.store';

@Injectable({ providedIn: 'root' })
export class DashboardQuery extends QueryEntity<DashboardState> {
  public me = this.select('me');
  public indicators = this.select('indicators');

  constructor(protected store: DashboardStore) {
    super(store);
  }
}
