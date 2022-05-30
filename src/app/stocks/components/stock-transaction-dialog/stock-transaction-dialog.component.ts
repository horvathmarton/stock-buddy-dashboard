import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { DisposableComponent } from 'src/app/shared/components';
import {
  integerValidator,
  tickerExistsValidator,
} from 'src/app/shared/validators';
import { Stock, StockPortfolio, StockTransaction } from '../../interfaces';
import { StockService } from '../../services';
import { StockPortfolioQuery, StockQuery } from '../../state';

@Component({
  templateUrl: './stock-transaction-dialog.component.html',
  styleUrls: ['./stock-transaction-dialog.component.scss'],
})
export class StockTransactionDialogComponent
  extends DisposableComponent
  implements OnInit
{
  public readonly portfolios = this.portfoliosQuery.portfolios;
  public readonly tickerValidator = tickerExistsValidator(this.stocksQuery);

  public readonly form = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    id: null,
    ticker: [null, Validators.required, this.tickerValidator],
    amount: [null, [Validators.required, integerValidator()]],
    price: [null, [Validators.required, Validators.min(0)]],
    date: [new Date(), Validators.required],
    portfolio: [null, Validators.required],
    comment: null,
    /* eslint-enable */
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
          if (portfolio) {
            this.form.patchValue({ ...this.data, portfolio: portfolio.id });
          } else {
            this.form.patchValue(this.data);
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

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('min')) {
      const allowed = (control.getError('min') as { min: number }).min;

      return `Minimum ${allowed} is required.`;
    }

    if (control.hasError('nonInteger')) {
      return 'This field must be an integer.';
    }

    if (control.hasError('tickerNotExist')) {
      return "This ticker doesn't exist.";
    }

    return 'Unknown error.';
  }

  public handleTickerSearch(): Observable<Stock[]> {
    return this.form.controls.ticker.valueChanges.pipe(
      startWith<string>(''),
      switchMap((filter: string) => this.stocksQuery.filteredStocks(filter)),
      takeUntil(this.onDestroy)
    );
  }
}
