export interface StockPosition {
  /** Ticker identifier of the stock. */
  ticker: string;

  /** Name of the company. */
  name: string;

  /**  */
  first_purchase_date: string;

  /**  */
  latest_purchase_date: string;

  /** Yearly forward dividend per share for the stock. */
  dividend: number;

  /** Total yearly forward dividend income from the position. */
  dividend_income: number;

  /**  */
  dividend_yield: number;

  /**  */
  dividend_yield_on_cost: number;

  /**  */
  pnl: number;

  /**  */
  pnl_percentage: number;

  /**  */
  price: number;

  /**  */
  purchase_price: number;

  /**  */
  sector: string;

  /**  */
  shares: number;

  /**  */
  size: number;

  /**  */
  size_at_cost: number;
}
