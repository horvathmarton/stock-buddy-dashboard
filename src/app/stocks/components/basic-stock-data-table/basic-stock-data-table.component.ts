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
  selector: 'sb-basic-stock-data-table',
  templateUrl: './basic-stock-data-table.component.html',
  styleUrls: ['./basic-stock-data-table.component.scss'],
})
export class BasicStockDataTable implements OnInit, AfterViewInit {
  public readonly displayedColumns = [
    'ticker',
    'name',
    'sector',
    'price',
    'purchase_price',
    'shares',
    'first_purchase_date',
    'latest_purchase_date',
  ];

  public dataSource!: MatTableDataSource<unknown>;

  @Input()
  public positions!: unknown[];

  @ViewChild(MatSort)
  public sort!: MatSort;

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.positions);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
