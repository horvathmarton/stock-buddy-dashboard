import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, tap } from 'rxjs';
import { ExtendedWatchlistItem } from '../../views';

@Component({
  selector: 'sb-watchlist-items-table',
  templateUrl: './watchlist-items-table.component.html',
  styleUrls: ['./watchlist-items-table.component.scss'],
})
export class WatchlistItemsTable implements OnInit {
  public readonly displayedColumns = [
    'ticker',
    'nextTargetPrice',
    'nextPositionSize',
    'nextPositionSizeAtCost',
    'targetPrices',
    'positionSizes',
    'controls',
  ];
  public readonly targetMapping = {
    '=0': 'No targets',
    '=1': '# target',
    other: '# targets',
  };
  public readonly fallbackValue = 'N/A';

  public dataSource!: MatTableDataSource<ExtendedWatchlistItem>;

  @Input()
  public watchlistItemsStream!: Observable<ExtendedWatchlistItem[]>;

  @Input()
  public createItem!: Subject<null>;

  @Input()
  public editItem!: Subject<string>;

  @Input()
  public deleteItem!: Subject<string>;

  @ViewChild(MatSort)
  public sort!: MatSort;

  public ngOnInit(): void {
    this.watchlistItemsStream
      .pipe(
        tap((watchlistItems) => {
          this.dataSource = new MatTableDataSource(watchlistItems);
          this.dataSource.sort = this.sort;
          this.dataSource.sortingDataAccessor = (item, property) =>
            this.sortingDataAccessor(item, property);
        })
      )
      .subscribe();
  }

  public addToWatchlist(event: Event): void {
    event.stopImmediatePropagation();

    this.createItem.next(null);
  }

  public editOnWatchlist(event: Event, ticker: string): void {
    event.stopImmediatePropagation();

    this.editItem.next(ticker);
  }

  public removeFromWatchlist(event: Event, ticker: string): void {
    event.stopImmediatePropagation();

    this.deleteItem.next(ticker);
  }

  private sortingDataAccessor(
    item: ExtendedWatchlistItem,
    property: string
  ): string | number {
    switch (property) {
      case 'ticker':
        return item.ticker;
      case 'nextTargetPrice':
        return item.targetPrice?.change ?? this.fallbackValue;
      case 'nextPositionSize':
        return item.positionSize?.change ?? this.fallbackValue;
      case 'nextPositionSizeAtCost':
        return item.positionSizeAtCost?.change ?? this.fallbackValue;
      case 'targetPrices':
        return item.target_prices.length;
      case 'positionSizes':
        return item.position_sizes.length;
      default:
        return this.fallbackValue;
    }
  }
}
