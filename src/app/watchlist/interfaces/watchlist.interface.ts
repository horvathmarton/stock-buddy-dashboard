import { WatchlistItem } from './watchlist-item.interface';
import { WatchlistListItem } from './watchlist-list-item.interface';

export interface Watchlist extends WatchlistListItem {
  items: WatchlistItem[];
}
