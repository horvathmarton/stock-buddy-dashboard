import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { PortfolioIndicators } from '../interfaces';

export interface PortfolioIndicatorsState {
  indicators: PortfolioIndicators | null;
}

@StoreConfig({ name: 'portfolio-indicators' })
@Injectable({ providedIn: 'root' })
export class PortfolioIndicatorsStore extends Store<PortfolioIndicatorsState> {
  constructor() {
    super({ indicators: null });
  }
}
