import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { StockQuery, StockPortfolioQuery } from '../../stocks/state';
import { Watchlist } from '../interfaces';

interface TargetInfo {
  current: number;
  nextTarget: number;
  change: number;
}

export type TargetInfoMap = Record<
  'targetPrice' | 'positionSize' | 'positionSizeAtCost',
  TargetInfo | null
>;
export type TargetsMap = Record<string, TargetInfoMap>;

@Injectable({ providedIn: 'root' })
export class TargetsService {
  constructor(
    private readonly stockQuery: StockQuery,
    private readonly portfolioQuery: StockPortfolioQuery
  ) {}

  public nextTargets(watchlist: Watchlist): Observable<TargetsMap> {
    return this.stockQuery.stocks.pipe(
      switchMap((stocks) =>
        this.portfolioQuery.summary.pipe(
          map((portfolio) => ({ stocks, portfolio, watchlist }))
        )
      ),
      map(({ stocks, portfolio }) => {
        return watchlist.items.reduce<TargetsMap>((targets, item) => {
          const stockPrice = stocks.find(
            (stock) => stock.ticker === item.ticker
          )?.price;
          const position = portfolio?.positions[item.ticker];

          const result: TargetInfoMap = {
            targetPrice: null,
            positionSize: null,
            positionSizeAtCost: null,
          };

          if (stockPrice && item.target_prices.length > 0) {
            const target = item.target_prices
              .map((target) => ({
                ...target,
                diff: Math.abs(target.price - stockPrice),
              }))
              .sort((a, b) => a.diff - b.diff)[0];

            result.targetPrice = {
              current: stockPrice,
              nextTarget: target.price,
              change: (stockPrice - target.price) / target.price,
            };
          }

          const positionSizeTargets = item.position_sizes.filter(
            (target) => !target.at_cost
          );
          if (position && positionSizeTargets.length > 0) {
            const target =
              positionSizeTargets
                .sort((a, b) => a.size - b.size)
                .find((target) => target.size > position.size) ??
              positionSizeTargets[0];

            result.positionSize = {
              current: position.size,
              nextTarget: target.size,
              change: (position.size - target.size) / target.size,
            };
          }

          const positionSizeAtCostTargets = item.position_sizes.filter(
            (target) => target.at_cost
          );
          if (position && positionSizeAtCostTargets.length > 0) {
            const target =
              positionSizeAtCostTargets
                .sort((a, b) => a.size - b.size)
                .find((target) => target.size > position.size_at_cost) ??
              positionSizeAtCostTargets[0];

            result.positionSizeAtCost = {
              current: position.size_at_cost,
              nextTarget: target.size,
              change: (position.size_at_cost - target.size) / target.size,
            };
          }

          targets[item.ticker] = result;

          return targets;
        }, {});
      })
    );
  }
}
