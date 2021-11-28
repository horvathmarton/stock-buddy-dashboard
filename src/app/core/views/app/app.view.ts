import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.view.html',
  styleUrls: ['./app.view.scss'],
})
export class AppViewComponent {
  private isDark = false;

  @HostBinding('class')
  public get theme(): string {
    const mode = this.isDark ? 'dark-mode' : 'light-mode';

    return `mat-app-background ${mode}`;
  }

  public toggleDarkMode(): void {
    this.isDark = !this.isDark;
  }
}
