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
  selector: 'sb-stock-risk-table',
  templateUrl: './stock-risk-table.component.html',
  styleUrls: ['./stock-risk-table.component.scss'],
})
export class StockRiskTable implements OnInit, AfterViewInit {
  public readonly displayedColumns = ['ticker', 'size_at_cost', 'size'];

  public dataSource!: MatTableDataSource<unknown>;

  @Input()
  public riskData!: unknown[];

  @ViewChild(MatSort)
  public sort!: MatSort;

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.riskData);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
