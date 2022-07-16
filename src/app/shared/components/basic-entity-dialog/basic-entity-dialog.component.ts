import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasicEntity } from '../../interfaces';

interface DialogData {
  title: string;
  entity: BasicEntity;
}

@Component({
  templateUrl: './basic-entity-dialog.component.html',
  styleUrls: ['./basic-entity-dialog.component.scss'],
})
export class BasicEntityDialogComponent implements OnInit {
  public form = this.builder.group({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
  });

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<BasicEntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) { }

  public ngOnInit(): void {
    this.form.patchValue(this.data.entity);
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.dialogRef.close(this.form.value);
  }

  public getErrorMessage(control: AbstractControl | null): string {
    if (control === null) return 'Unknown error.';

    if (control.hasError('required')) return 'This field is required.';

    return 'Unknown error.';
  }
}
