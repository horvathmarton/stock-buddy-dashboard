import { PositionSize } from './position-size.interface';
import { TargetPrice } from './target-price.interface';

export interface WatchlistItem {
  ticker: string;

  target_prices: TargetPrice[];

  position_sizes: PositionSize[];
}
