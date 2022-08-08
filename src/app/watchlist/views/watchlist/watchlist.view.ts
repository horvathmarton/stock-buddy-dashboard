import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import {
  BasicEntityDialogComponent,
  ConfirmationDialogComponent,
  DisposableComponent,
} from 'src/app/shared/components';
import { ErrorService } from 'src/app/shared/services';
import { isDefined } from 'src/app/shared/utils';
import { PortfolioService, StockService } from '../../../stocks/services';
import {
  WatchlistItemEditorDialogComponent,
  WatchlistItemEditorDialogResult,
} from '../../components';
import { Watchlist, WatchlistItem, WatchlistListItem } from '../../interfaces';
import {
  TargetInfoMap,
  TargetsMap,
  TargetsService,
  WatchlistService,
} from '../../services';
import { WatchlistQuery } from '../../state';

export type ExtendedWatchlistItem = WatchlistItem & TargetInfoMap;

@Component({
  templateUrl: './watchlist.view.html',
  styleUrls: ['./watchlist.view.scss'],
})
export class WatchlistViewComponent
  extends DisposableComponent
  implements OnInit
{
  public readonly isLoading = this.query.selectLoading();

  public readonly form = this.builder.group({
    ownedOnly: false,
    selectedWatchlist: new FormControl<Watchlist | null>(null),
  });

  public readonly watchlistTargets = this.query.details.pipe(
    filter(isDefined),
    switchMap((watchlist) => this.targetsService.nextTargets(watchlist))
  );
  public readonly watchlistItems = this.query.watchlistItems.pipe(
    switchMap((items) =>
      this.watchlistTargets.pipe(
        map((targets) => this.mergeItemData(items, targets)),
        map((items) =>
          items.filter(
            (item) =>
              !this.form.controls.ownedOnly.getRawValue() ||
              item.positionSizeAtCost
          )
        )
      )
    )
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
    private readonly builder: FormBuilder,
    private readonly stockService: StockService,
    private readonly errorService: ErrorService,
    private readonly targetsService: TargetsService,
    private readonly watchlistService: WatchlistService,
    private readonly portfolioService: PortfolioService
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

    this.errorService
      .showErrors(this.query.selectError())
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
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
    this.form.controls.selectedWatchlist.valueChanges
      .pipe(
        filter(isDefined),
        map((watchlist: Watchlist) => watchlist.id),
        tap((watchlistId: number) => this.watchlistService.fetch(watchlistId)),
        takeUntil(this.onDestroy)
      )
      .subscribe();

    this.form.controls.ownedOnly.valueChanges
      .pipe(
        map(() => this.form.controls.selectedWatchlist.getRawValue()),
        filter(isDefined),
        tap((watchlist: Watchlist) =>
          this.watchlistService.fetch(watchlist.id)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  private initializeControls(): void {
    this.query.watchlists
      .pipe(
        filter(isDefined),
        filter((watchlists: WatchlistListItem[]) => watchlists.length > 0),
        tap((watchlists) =>
          this.form.patchValue({
            selectedWatchlist: watchlists[0] as Watchlist,
          })
        ),
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

  private mergeItemData(
    items: WatchlistItem[],
    targets: TargetsMap
  ): ExtendedWatchlistItem[] {
    return items.map((item) => {
      const target = targets[item.ticker] ?? {};

      return {
        ...item,
        targetPrice: target.targetPrice,
        positionSize: target.positionSize,
        positionSizeAtCost: target.positionSizeAtCost,
      };
    });
  }
}
