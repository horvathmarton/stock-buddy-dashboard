import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WatchlistListItem } from '../interfaces';
import { Watchlist } from '../interfaces/watchlist.interface';

export interface WatchlistState extends EntityState<WatchlistListItem> {
  details: Watchlist | null;
}

@StoreConfig({ name: 'watchlists' })
@Injectable({ providedIn: 'root' })
export class WatchlistStore extends EntityStore<WatchlistState> {
  constructor() {
    super({ details: null });
  }
}
