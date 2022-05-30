import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  WatchlistItemEditorDialogComponent,
  WatchlistItemsTable,
} from './components';
import { WatchlistViewComponent } from './views';
import { WatchlistRoutingModule } from './watchlist-routing.module';

const VIEWS = [WatchlistViewComponent];
const COMPONENTS = [WatchlistItemsTable, WatchlistItemEditorDialogComponent];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    WatchlistRoutingModule,
  ],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class WatchlistModule {}
