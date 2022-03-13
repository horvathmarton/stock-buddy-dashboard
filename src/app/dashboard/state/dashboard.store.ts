import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { PortfolioIndicators, Strategy } from '../interfaces';

export interface DashboardState extends EntityState<Strategy, string> {
  me: { current: Strategy; target: Strategy } | null;
  indicators: PortfolioIndicators | null;
}

@StoreConfig({ name: 'dashboard' })
@Injectable({ providedIn: 'root' })
export class DashboardStore extends EntityStore<DashboardState> {
  constructor() {
    super();
  }
}
