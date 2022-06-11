import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { isDefined } from '@datorama/akita';
import { filter, map, merge, Observable, tap } from 'rxjs';
import { ErrorResponse } from '../types';

type ErrorMessage = string | ErrorResponse | ProgressEvent;

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {}

  public showErrors(
    ...errorStreams: Observable<undefined | null | ErrorMessage>[]
  ): Observable<void> {
    return merge(...errorStreams).pipe(
      filter(isDefined),
      map((error: ErrorMessage) => {
        if (this.isProgressEvent(error)) {
          void this.router.navigate(['/', 'no-connection']);

          return null;
        }

        if (this.isErrorResponse(error)) return error.detail;

        return error;
      }),
      filter(isDefined),
      tap((errorMessage: string) =>
        this.snackbar.open(errorMessage, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        })
      ),
      map(() => undefined)
    );
  }

  private isErrorResponse(error: ErrorMessage): error is ErrorResponse {
    return (error as ErrorResponse).detail !== undefined;
  }

  private isProgressEvent(error: ErrorMessage): error is ProgressEvent {
    return (error as ProgressEvent).BUBBLING_PHASE !== undefined;
  }
}
