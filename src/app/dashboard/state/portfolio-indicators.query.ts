import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  PortfolioIndicatorsState,
  PortfolioIndicatorsStore,
} from './portfolio-indicators.store';

@Injectable({ providedIn: 'root' })
export class PortfolioIndicatorsQuery extends Query<PortfolioIndicatorsState> {
  public indicators = this.select('indicators');

  constructor(protected store: PortfolioIndicatorsStore) {
    super(store);
  }
}
