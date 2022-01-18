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
  selector: 'sb-stock-dividend-table',
  templateUrl: './stock-dividend-table.component.html',
  styleUrls: ['./stock-dividend-table.component.scss'],
})
export class StockDividendTableComponent implements OnInit, AfterViewInit {
  public readonly displayedColumns = ['ticker', 'dividend', 'dividend_yield'];

  public dataSource!: MatTableDataSource<unknown>;

  @Input()
  public dividendData!: unknown[];

  @ViewChild(MatSort)
  public sort!: MatSort;

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dividendData);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
