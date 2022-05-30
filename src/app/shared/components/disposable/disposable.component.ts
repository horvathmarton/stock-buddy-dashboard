import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class DisposableComponent implements OnDestroy {
  protected readonly onDestroy = new Subject<boolean>();

  public ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
