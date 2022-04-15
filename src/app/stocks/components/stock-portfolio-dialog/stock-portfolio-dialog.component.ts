import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockPortfolio } from '../../interfaces';

@Component({
  templateUrl: './stock-portfolio-dialog.component.html',
  styleUrls: ['./stock-portfolio-dialog.component.scss'],
})
export class StockPortfolioDialogComponent implements OnInit {
  public form = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    id: null,
    name: [null, Validators.required],
    description: null,
    /* eslint-enable */
  });

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<StockPortfolioDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: StockPortfolio
  ) {}

  public ngOnInit(): void {
    this.form.patchValue(this.data);
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.value);
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    return 'Unknown error.';
  }
}
