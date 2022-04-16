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
import { integerValidator } from 'src/app/shared/validators';
import { ASSET_TYPES } from '../../data';

@Component({
  templateUrl: './strategy-editor-dialog.component.html',
  styleUrls: ['./strategy-editor-dialog.component.scss'],
})
export class StrategyEditorDialogComponent implements OnInit {
  public readonly ASSET_TYPES = ASSET_TYPES;
  public readonly form = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    name: [null, Validators.required],
    // TODO: Add validator to not allow duplicates.
    // TODO: Add validator to enforce adding up to 100% or pad to 100% with cash.
    items: this.builder.array([]),
    /* eslint-enable */
  });

  public get strategyItems(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(
    private readonly builder: FormBuilder,
    private readonly dialogRef: MatDialogRef<StrategyEditorDialogComponent>
  ) {}

  public ngOnInit(): void {
    this.addStrategyItem();
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.value);
  }

  public addStrategyItem(): void {
    /* eslint-disable @typescript-eslint/unbound-method */
    this.strategyItems.push(
      this.builder.group({
        name: [null, Validators.required],
        size: [null, [Validators.required, integerValidator()]],
      })
    );
    /* eslint-enable */
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) {
      return 'This field is required.';
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
