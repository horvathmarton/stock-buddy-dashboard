import { StrategyItem } from './strategy-item.interface';

export interface Strategy {
  name: string;
  owner: string;
  items: StrategyItem[];
}
