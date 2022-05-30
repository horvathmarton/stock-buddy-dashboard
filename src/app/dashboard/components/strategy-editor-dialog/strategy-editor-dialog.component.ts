import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DisposableComponent } from 'src/app/shared/components';
import { integerValidator, uniqueItem } from 'src/app/shared/validators';
import { ASSET_TYPES } from '../../data';
import { strategySum } from '../../validators';

@Component({
  templateUrl: './strategy-editor-dialog.component.html',
  styleUrls: ['./strategy-editor-dialog.component.scss'],
})
export class StrategyEditorDialogComponent
  extends DisposableComponent
  implements OnInit
{
  public readonly ASSET_TYPES = ASSET_TYPES;
  public readonly form = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    name: [null, Validators.required],
    items: this.builder.array([], [uniqueItem(), strategySum()]),
    /* eslint-enable */
  });

  public get strategyItems(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(
    private readonly builder: FormBuilder,
    private readonly dialogRef: MatDialogRef<StrategyEditorDialogComponent>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.addStrategyItem(ASSET_TYPES[0].value, 100);
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const items = (
      this.strategyItems.value as { name: string; size: number }[]
    ).map((item) => ({
      name: item.name,
      size: item.size / 100,
    }));

    this.dialogRef.close({
      ...this.form.value,
      items,
    });
  }

  public addStrategyItem(name?: string, size?: number): void {
    /* eslint-disable @typescript-eslint/unbound-method */
    this.strategyItems.push(
      this.builder.group({
        name: [name ?? null, Validators.required],
        size: [
          size ?? null,
          [Validators.required, Validators.min(0), integerValidator()],
        ],
      })
    );
    /* eslint-enable */
  }

  public removeStrategyItem(index: number): void {
    this.strategyItems.removeAt(index);
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('nonUniqueItems')) {
      return 'Strategy items must be unique.';
    }

    if (control.hasError('strategySum')) {
      return 'Strategy sizes must be add up to exactly 100%.';
    }

    return 'Unknown error.';
  }

  public getStrategyItemControls(index: number): {
    name: FormControl;
    size: FormControl;
  } {
    return (this.strategyItems.controls[index] as FormGroup).controls as {
      name: FormControl;
      size: FormControl;
    };
  }
}
