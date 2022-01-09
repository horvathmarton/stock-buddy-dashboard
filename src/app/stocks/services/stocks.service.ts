import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StocksService {
  constructor(private readonly http: HttpClient) {}

  public summary(): Observable<unknown> {
    return this.http.get(`/stocks/portfolios/summary/`);
  }
}
