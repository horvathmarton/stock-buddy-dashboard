import { Currency } from 'src/app/shared/types';

export interface CashTransaction {
  currency: Currency;
  amount: number;
  date: string;
  owner: string;
  portfolio: number;
}
