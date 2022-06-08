import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, Subject } from 'rxjs';
import { WatchlistItem } from '../../interfaces';
import { TargetsMap } from '../../services';

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

  public dataSource!: Observable<MatTableDataSource<WatchlistItem>>;

  @Input()
  public watchlistItemsStream!: Observable<WatchlistItem[]>;

  @Input()
  public createItem!: Subject<null>;

  @Input()
  public editItem!: Subject<string>;

  @Input()
  public deleteItem!: Subject<string>;

  @Input()
  public targets!: Observable<TargetsMap>;

  public ngOnInit(): void {
    this.dataSource = this.watchlistItemsStream.pipe(
      map(
        (watchlistItems) =>
          new MatTableDataSource<WatchlistItem>(watchlistItems)
      )
    );
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
}
