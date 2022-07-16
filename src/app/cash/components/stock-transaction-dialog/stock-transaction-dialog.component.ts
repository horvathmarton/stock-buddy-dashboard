import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { filter, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { DisposableComponent } from 'src/app/shared/components';
import { isDefined } from 'src/app/shared/utils';
import {
  integerValidator,
  tickerExistsValidator,
} from 'src/app/shared/validators';
import {
  Stock,
  StockPortfolio,
  StockTransaction,
} from '../../../stocks/interfaces';
import { StockService } from '../../../stocks/services';
import { StockPortfolioQuery, StockQuery } from '../../../stocks/state';

@Component({
  templateUrl: './stock-transaction-dialog.component.html',
  styleUrls: ['./stock-transaction-dialog.component.scss'],
})
export class StockTransactionDialogComponent
  extends DisposableComponent
  implements OnInit {
  public readonly portfolios = this.portfoliosQuery.portfolios;
  public readonly tickerValidator = tickerExistsValidator(this.stocksQuery);

  public readonly form = this.builder.group({
    id: new FormControl<number | null>(null),
    ticker: new FormControl<string | null>(null, Validators.required, this.tickerValidator),
    amount: new FormControl<number | null>(null, [Validators.required, integerValidator()]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    date: new Date(),
    portfolio: new FormControl<number | null>(null, Validators.required),
    comment: new FormControl<string | null>(null),
  });

  public stocks!: Observable<Stock[]>;

  constructor(
    private readonly builder: FormBuilder,
    private readonly dialogRef: MatDialogRef<StockTransactionDialogComponent>,
    private readonly stockService: StockService,
    private readonly stocksQuery: StockQuery,
    private readonly portfoliosQuery: StockPortfolioQuery,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: StockTransaction
  ) {
    super();
  }

  public ngOnInit(): void {
    this.stockService.list();
    this.stocks = this.handleTickerSearch();

    this.portfoliosQuery.selectedPortfolio
      .pipe(
        take(1),
        tap((portfolio: StockPortfolio | undefined) => {
          this.form.patchValue({ ...this.data, date: new Date(this.data.date) })

          if (portfolio) {
            this.form.patchValue({ portfolio: portfolio.id });
          }
        })
      )
      .subscribe();
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close({
      ...this.form.value,
      date: format(this.form.get('date')?.value as Date, 'yyyy-MM-dd'),
    });
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) return 'This field is required.';

    if (control.hasError('min')) {
      const allowed = (control.getError('min') as { min: number }).min;

      return `Minimum ${allowed} is required.`;
    }

    if (control.hasError('nonInteger')) return 'This field must be an integer.';

    if (control.hasError('tickerNotExist')) return "This ticker doesn't exist.";

    return 'Unknown error.';
  }

  public handleTickerSearch(): Observable<Stock[]> {
    return this.form.controls.ticker.valueChanges.pipe(
      filter(isDefined),
      startWith(''),
      switchMap((filter: string) => this.stocksQuery.filteredStocks(filter)),
      takeUntil(this.onDestroy)
    );
  }
}
