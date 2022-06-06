import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { format } from 'date-fns';
import { take, tap } from 'rxjs';
import { DisposableComponent } from 'src/app/shared/components';
import { StockPortfolio } from 'src/app/stocks/interfaces';
import { StockPortfolioQuery } from 'src/app/stocks/state';
import { CURRENCIES } from '../../data';
import { CashTransaction } from '../../interfaces';

@Component({
  templateUrl: './cash-transaction-dialog.component.html',
  styleUrls: ['./cash-transaction-dialog.component.scss'],
})
export class CashTransactionDialogComponent
  extends DisposableComponent
  implements OnInit
{
  public readonly CURRENCIES = CURRENCIES;

  public readonly portfolios = this.portfoliosQuery.portfolios;

  public readonly form = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    currency: [null, Validators.required],
    amount: [null, Validators.required],
    date: [new Date(), Validators.required],
    portfolio: [null, Validators.required],
    /* eslint-enable */
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: CashTransaction,
    private readonly builder: FormBuilder,
    private readonly dialogRef: MatDialogRef<CashTransactionDialogComponent>,
    private readonly portfoliosQuery: StockPortfolioQuery
  ) {
    super();
  }

  public ngOnInit(): void {
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
    if (control === null) return 'Unknown error';

    if (control.hasError('required')) return 'This field is required';

    return 'Unknown error';
  }
}
