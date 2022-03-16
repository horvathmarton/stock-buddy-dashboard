import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { StrategiesState, StrategiesStore } from './strategies.store';

@Injectable({ providedIn: 'root' })
export class StrategiesQuery extends QueryEntity<StrategiesState> {
  public me = this.select('me');

  constructor(protected store: StrategiesStore) {
    super(store);
  }
}
