import { StrategyItem } from './strategy-item.interface';

export interface Strategy {
  id: number;
  name: string;
  owner: string;
  items: StrategyItem[];
}
