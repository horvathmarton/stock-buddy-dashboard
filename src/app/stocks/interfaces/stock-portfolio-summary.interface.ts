import { StockPosition } from './stock-positions.interface';

export interface StockPortfolioSummary {
  /** Total AUM of the portfolio. */
  assets_under_management: number;

  /** Sum of capital invested into the portfolio. */
  capital_invested: number;

  /** Total yearly dividend income of the portfolio. */
  dividend: number;

  /** Contribution to the dividend income per stock in percentage. */
  dividend_distribution: Record<string, number>;

  /** Dividend yield of the portfolio. */
  dividend_yield: number;

  /** Number of positions in the portfolio. */
  number_of_positions: number;

  /** Name of the portfolio owner. */
  owner: string;

  /** Detailed info about the positions in the portfolio. */
  positions: Record<string, StockPosition>;

  /** Size distribution of the portfolio grouped by sectors. */
  sector_distribution: Record<string, number>;

  /** Size distribution of the portfolio per position at cost. */
  size_at_cost_distribution: Record<string, number>;

  /** Size distribution of the portfolio per position at latest price. */
  size_distribution: Record<string, number>;
}
