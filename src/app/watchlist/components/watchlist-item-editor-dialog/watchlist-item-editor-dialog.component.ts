import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, switchMap, takeUntil } from 'rxjs';
import { DisposableComponent } from 'src/app/shared/components';
import { uniqueItem } from 'src/app/shared/validators';
import { Stock } from 'src/app/stocks/interfaces';
import { StockService } from 'src/app/stocks/services';
import { StockQuery } from 'src/app/stocks/state';
import { PositionSize, TargetPrice, WatchlistItem } from '../../interfaces';

interface DialogData {
  item: WatchlistItem;
}

export interface WatchlistItemEditorDialogResult {
  ticker: string;
  targetPrices: TargetPrice[];
  positionSizes: (Omit<PositionSize, 'at_cost'> & { atCost: boolean })[];
}

@Component({
  templateUrl: './watchlist-item-editor-dialog.component.html',
  styleUrls: ['./watchlist-item-editor-dialog.component.scss'],
})
export class WatchlistItemEditorDialogComponent
  extends DisposableComponent
  implements OnInit
{
  public mode!: 'create' | 'edit';

  public readonly form = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    ticker: [null, Validators.required],
    targetPrices: this.builder.array([], [uniqueItem()]),
    positionSizes: this.builder.array([], [uniqueItem()]),
    /* eslint-disable */
  });

  public stocks!: Observable<Stock[]>;

  public get targetPrices(): FormArray {
    return this.form.get('targetPrices') as FormArray;
  }

  public get positionSizes(): FormArray {
    return this.form.get('positionSizes') as FormArray;
  }

  constructor(
    private readonly builder: FormBuilder,
    private readonly dialogRef: MatDialogRef<WatchlistItemEditorDialogComponent>,
    private readonly stocksService: StockService,
    private readonly stocksQuery: StockQuery,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {
    super();
  }

  public ngOnInit(): void {
    this.mode = this.data.item ? 'edit' : 'create';

    this.populateForm();

    this.stocksService.list();
    this.stocks = this.handleTickerSearch();
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      console.log(this.form);

      return;
    }

    this.dialogRef.close({ ...this.form.value });
  }

  public addTargetPrice(name?: string, price?: number): void {
    this.targetPrices.push(
      this.builder.group({
        name: [name ?? null, Validators.required],
        price: [price ?? null, [Validators.required, Validators.min(0)]],
      })
    );
  }

  public removeTargetPrice(index: number): void {
    this.targetPrices.removeAt(index);
  }

  public addPositionSize(name?: string, size?: number, atCost?: boolean): void {
    this.positionSizes.push(
      this.builder.group({
        name: [name ?? null, Validators.required],
        size: [size ?? null, [Validators.required, Validators.min(0)]],
        atCost: [atCost ?? true, Validators.required],
      })
    );
  }

  public removePositionSize(index: number): void {
    this.positionSizes.removeAt(index);
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) return 'This field is required';

    if (control.hasError('nonUniqueItems')) return 'Names must be unique';

    return 'Unknown error.';
  }

  public handleTickerSearch(): Observable<Stock[]> {
    return this.form.controls.ticker.valueChanges.pipe(
      startWith<string>(''),
      switchMap((filter: string) => this.stocksQuery.filteredStocks(filter)),
      takeUntil(this.onDestroy)
    );
  }

  public getTargetPriceControls(index: number): {
    name: FormControl;
    price: FormControl;
    description: FormControl;
  } {
    return (this.targetPrices.controls[index] as FormGroup).controls as {
      name: FormControl;
      price: FormControl;
      description: FormControl;
    };
  }

  public getPositionSizeControls(index: number): {
    name: FormControl;
    size: FormControl;
    atCost: FormControl;
    description: FormControl;
  } {
    return (this.positionSizes.controls[index] as FormGroup).controls as {
      name: FormControl;
      size: FormControl;
      atCost: FormControl;
      description: FormControl;
    };
  }

  private populateForm(): void {
    this.form.patchValue(this.data.item);

    this.data.item.target_prices.forEach(({ name, price }) => {
      this.addTargetPrice(name, price);
    });

    this.data.item.position_sizes.forEach(({ name, size, at_cost }) =>
      this.addPositionSize(name, size, at_cost)
    );
  }
}
