import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, Subject } from 'rxjs';
import { StockTransaction } from 'src/app/stocks/interfaces';
import { CashTransaction, ForexTransaction } from '../../interfaces';

type Transaction = CashTransaction & ForexTransaction & StockTransaction;

@Component({
  selector: 'sb-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit {
  public dataSource!: Observable<MatTableDataSource<Transaction>>;

  @Input()
  public transactionsStream!: Observable<Transaction[]>;

  @Input()
  public displayedColumns!: (keyof Transaction)[];

  @Input()
  public createTransaction!: Subject<null>;

  @Input()
  public title!: string;

  public ngOnInit(): void {
    this.dataSource = this.transactionsStream.pipe(
      map((transactions) => new MatTableDataSource<Transaction>(transactions))
    );
  }

  public createNew(): void {
    this.createTransaction.next(null);
  }
}
