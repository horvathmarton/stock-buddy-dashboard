import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type VersionInfo = { version: string; commit: string };

@Injectable({ providedIn: 'root' })
export class CoreService {
  constructor(private readonly http: HttpClient) {}

  public version(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>('/version');
  }
}
