import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Strategy } from '../interfaces';

export interface StrategiesState extends EntityState<Strategy, string> {
  me: { current: Strategy; target: Strategy } | null;
}

@StoreConfig({ name: 'stretegies' })
@Injectable({ providedIn: 'root' })
export class StrategiesStore extends EntityStore<StrategiesState> {
  constructor() {
    super();
  }
}
