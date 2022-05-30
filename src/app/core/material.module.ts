import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';

const MODULES = [
  NgApexchartsModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatSidenavModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatCheckboxModule,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'hu-HU' }],
})
export class MaterialModule {}
