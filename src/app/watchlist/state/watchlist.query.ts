import { Injectable } from '@angular/core';
import { isDefined, QueryEntity } from '@datorama/akita';
import { filter, map } from 'rxjs';
import { Watchlist } from '../interfaces';
import { WatchlistState, WatchlistStore } from './watchlist.store';

@Injectable({ providedIn: 'root' })
export class WatchlistQuery extends QueryEntity<WatchlistState> {
  public watchlists = this.selectAll();
  public hasWatchlists = this.selectCount().pipe(map((count) => count > 0));

  public details = this.select('details');
  public watchlistItems = this.details.pipe(
    filter(isDefined),
    map((watchlist: Watchlist) => watchlist.items)
  );
  public hasWatchlistItems = this.watchlistItems.pipe(
    map((items) => items.length > 0)
  );

  constructor(protected store: WatchlistStore) {
    super(store);
  }
}
