import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'sb-stock-pnl-table',
  templateUrl: './stock-pnl-table.component.html',
  styleUrls: ['./stock-pnl-table.component.scss'],
})
export class StockPnlTableComponent implements OnInit, AfterViewInit {
  public readonly displayedColumns = ['ticker', 'pnl', 'pnl_percentage'];

  public dataSource!: MatTableDataSource<unknown>;

  @Input()
  public pnlData!: unknown[];

  @ViewChild(MatSort)
  public sort!: MatSort;

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.pnlData);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
