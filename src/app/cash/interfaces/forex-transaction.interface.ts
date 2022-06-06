import { Currency } from 'src/app/shared/types';

export interface ForexTransaction {
  date: string;
  amount: number;
  ratio: number;
  source_currency: Currency;
  target_currency: Currency;
  owner: string;
  portfolio: number;
}
