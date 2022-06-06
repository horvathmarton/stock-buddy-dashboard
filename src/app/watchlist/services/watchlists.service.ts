import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, pluck, tap } from 'rxjs';
import { defaultCatchError } from 'src/app/shared/operators';
import { ApiPaginationResponse } from 'src/app/shared/types';
import { Watchlist, WatchlistItem, WatchlistListItem } from '../interfaces';
import { WatchlistStore } from '../state';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: WatchlistStore
  ) {}

  public list(): void {
    this.store.setLoading(true);

    this.http
      .get<ApiPaginationResponse<WatchlistListItem>>(`/stocks/watchlists`)
      .pipe(
        pluck('results'),
        tap((watchlists) => this.store.set(watchlists)),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public fetch(watchlistId: number): void {
    this.store.setLoading(true);

    this.http
      .get<Watchlist>(`/stocks/watchlists/${watchlistId}`)
      .pipe(
        tap((watchlist) => void this.store.update({ details: watchlist })),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public create(watchlist: WatchlistListItem): void {
    this.store.setLoading(true);

    this.http
      .post<WatchlistListItem>(`/stocks/watchlists`, watchlist)
      .pipe(
        tap((watchlist) => this.store.add(watchlist)),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public update(watchlist: WatchlistListItem): void {
    this.store.setLoading(true);

    this.http
      .put<WatchlistListItem>(`/stocks/watchlists/${watchlist.id}`, watchlist)
      .pipe(
        tap(
          (updatedWatchlist) =>
            void this.store.update(
              updatedWatchlist.id.toString(),
              updatedWatchlist
            )
        ),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public createItem(watchlist: WatchlistListItem, ticker: string): void {
    this.store.setLoading(true);

    this.http
      .post<WatchlistItem>(
        `/stocks/watchlists/${watchlist.id}/stocks/${ticker}`,
        null
      )
      .pipe(
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false)),
        tap(() => this.fetch(watchlist.id))
      )
      .subscribe();
  }

  public editItem(
    watchlist: WatchlistListItem,
    ticker: string,
    payload: Omit<WatchlistItem, 'ticker'>
  ): void {
    this.store.setLoading(true);

    this.http
      .put(`/stocks/watchlists/${watchlist.id}/stocks/${ticker}`, payload)
      .pipe(
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false)),
        tap(() => this.fetch(watchlist.id))
      )
      .subscribe();
  }

  public deleteItem(watchlist: WatchlistListItem, ticker: string): void {
    this.store.setLoading(true);

    this.http
      .delete<void>(`/stocks/watchlists/${watchlist.id}/stocks/${ticker}`)
      .pipe(
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false)),
        tap(() => this.fetch(watchlist.id))
      )
      .subscribe();
  }
}
