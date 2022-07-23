import { HttpErrorResponse } from '@angular/common/http';
import { Event, EventHint } from '@sentry/angular';

export const filterExceptions = (event: Event, hint: EventHint) => {
  const exception = hint.originalException;

  if (!exception) return event;

  if (typeof exception === 'string') {
    if (exception.endsWith('401 Unauthorized')) return null;
  } else {
    if ((exception as HttpErrorResponse).status === 401) return null;
  }

  return event;
};
