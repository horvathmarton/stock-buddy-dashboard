import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import {
  BasicEntityDialogComponent,
  ConfirmationDialogComponent,
  DisposableComponent,
} from 'src/app/shared/components';
import { isDefined } from 'src/app/shared/utils';
import { PortfolioService, StockService } from '../../../stocks/services';
import {
  WatchlistItemEditorDialogComponent,
  WatchlistItemEditorDialogResult,
} from '../../components';
import { Watchlist, WatchlistItem, WatchlistListItem } from '../../interfaces';
import { TargetsService, WatchlistService } from '../../services';
import { WatchlistQuery } from '../../state';

@Component({
  templateUrl: './watchlist.view.html',
  styleUrls: ['./watchlist.view.scss'],
})
export class WatchlistViewComponent
  extends DisposableComponent
  implements OnInit
{
  public readonly isLoading = this.query.selectLoading();
  public readonly error = this.query.selectError();

  public readonly selectedWatchlist = new FormControl();

  public readonly watchlist = this.query.details;
  public readonly watchlistItems = this.query.details.pipe(
    filter(isDefined),
    map((watchlist) => watchlist.items)
  );
  public readonly watchlistTargets = this.query.details.pipe(
    filter(isDefined),
    switchMap((watchlist) => this.targetsService.nextTargets(watchlist))
  );

  public readonly createItem = new Subject<null>();
  public readonly editItem = new Subject<string>();
  public readonly deleteItem = new Subject<string>();

  private readonly DIALOG_BASE_CONFIG = {
    minHeight: '300px',
    minWidth: '400px',
    width: '60vw',
    maxWidth: '700px',
  };

  constructor(
    public readonly query: WatchlistQuery,
    private readonly dialog: MatDialog,
    private readonly watchlistService: WatchlistService,
    private readonly portfolioService: PortfolioService,
    private readonly targetsService: TargetsService,
    private readonly stockService: StockService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initializeControls();

    this.stockService.list();
    this.watchlistService.list();
    this.portfolioService.summary();

    this.handleControlChanges();
    this.handleItemCreation();
    this.handleItemEdition();
    this.handleItemDeletion();
  }

  public createWatchlist(): void {
    this.dialog
      .open(BasicEntityDialogComponent, {
        ...this.DIALOG_BASE_CONFIG,
        data: { title: 'Create watchlist' },
      })
      .afterClosed()
      .pipe(
        filter((result) => isDefined(result)),
        tap((watchlist: WatchlistListItem) =>
          this.watchlistService.create(watchlist)
        )
      )
      .subscribe();
  }

  public editWatchlist(event: Event, id: number): void {
    event.stopImmediatePropagation();

    this.query.watchlists
      .pipe(
        switchMap((watchlists) =>
          this.dialog
            .open(BasicEntityDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
              data: {
                entity: watchlists.find((w) => w.id === id),
                title: 'Edit watchlist',
              },
            })
            .afterClosed()
        ),
        filter((result) => isDefined(result)),
        tap((watchlist: Watchlist) => this.watchlistService.update(watchlist)),
        take(1)
      )
      .subscribe();
  }

  private handleControlChanges(): void {
    this.selectedWatchlist.valueChanges
      .pipe(
        filter((result) => isDefined(result)),
        map((watchlist: Watchlist) => watchlist.id),
        tap((watchlistId: number) => this.watchlistService.fetch(watchlistId)),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  private initializeControls(): void {
    this.query.watchlists
      .pipe(
        filter(isDefined),
        filter((watchlists: WatchlistListItem[]) => watchlists.length > 0),
        tap((watchlists) => this.selectedWatchlist.patchValue(watchlists[0])),
        take(1)
      )
      .subscribe();
  }

  private handleItemCreation(): void {
    this.createItem
      .pipe(
        switchMap(() =>
          this.dialog
            .open(WatchlistItemEditorDialogComponent, {
              minWidth: '400px',
              width: '60vw',
              maxWidth: '700px',
              data: {},
            })
            .afterClosed()
        ),
        filter((result) => isDefined(result)),
        switchMap((result: WatchlistItem) =>
          this.query.details.pipe(
            filter(isDefined),
            take(1),
            map((watchlist) => ({ watchlist, result }))
          )
        ),
        tap(({ watchlist, result }) =>
          this.watchlistService.createItem(watchlist, result.ticker)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  private handleItemEdition(): void {
    this.editItem
      .pipe(
        switchMap((ticker) =>
          this.query.details.pipe(
            take(1),
            map((watchlist) => ({ watchlist, ticker }))
          )
        ),
        switchMap(({ watchlist, ticker }) =>
          this.dialog
            .open(WatchlistItemEditorDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
              data: {
                item: watchlist?.items.find(
                  (item: WatchlistItem) => item.ticker === ticker
                ),
              },
            })
            .afterClosed()
            .pipe(
              filter((result) => isDefined(result)),
              map((result: WatchlistItemEditorDialogResult) => ({
                watchlist,
                ticker,
                result,
              }))
            )
        ),
        map(({ watchlist, ticker, result }) => {
          const payload = {
            target_prices: result.targetPrices,
            position_sizes: result.positionSizes.map((target) => ({
              ...target,
              at_cost: target.atCost,
            })),
          };

          return { watchlist, ticker, payload };
        }),
        tap(
          ({ watchlist, ticker, payload }) =>
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            this.watchlistService.editItem(watchlist!, ticker, payload)
          /* eslint-enable */
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  private handleItemDeletion(): void {
    let currentTicker: string | null = null;

    this.deleteItem
      .pipe(
        tap((ticker) => (currentTicker = ticker)),
        switchMap(() =>
          this.dialog
            .open(ConfirmationDialogComponent, {
              minHeight: '200px',
              minWidth: '400px',
              maxWidth: '700px',
              data: {
                confirmationText: `Remove ${
                  currentTicker as string
                } from the watchlist?`,
              },
            })
            .afterClosed()
        ),
        filter((result) => !!result),
        switchMap(() => this.query.details.pipe(take(1))),
        filter(isDefined),
        tap((watchlist) =>
          this.watchlistService.deleteItem(watchlist, currentTicker as string)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }
}
