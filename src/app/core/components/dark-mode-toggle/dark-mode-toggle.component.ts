import { Component } from '@angular/core';
import { CoreQuery, CoreStore } from '../../state';

@Component({
  selector: 'sb-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
})
export class DarkModeToggleComponent {
  constructor(private store: CoreStore, public query: CoreQuery) {}

  public toggleDarkMode(): void {
    this.store.update((state) => ({
      ...state,
      isDark: !state.isDark,
    }));
  }
}
