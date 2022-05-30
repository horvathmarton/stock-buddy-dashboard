import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WatchlistState, WatchlistStore } from './watchlist.store';

@Injectable({ providedIn: 'root' })
export class WatchlistQuery extends QueryEntity<WatchlistState> {
  public watchlists = this.selectAll();
  public details = this.select('details');

  constructor(protected store: WatchlistStore) {
    super(store);
  }
}
