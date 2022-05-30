import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  confirmationText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {}
}
