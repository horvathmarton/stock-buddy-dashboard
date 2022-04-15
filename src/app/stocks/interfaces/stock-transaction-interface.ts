export interface StockTransaction {
  /** */
  ticker: string;

  /** */
  amount: number;

  /** */
  price: number;

  /** */
  date: string;

  /** */
  portfolio: number;

  /** */
  comment?: string;
}
