import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
})
export class LoginViewComponent {
  public form = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  constructor(private readonly fb: FormBuilder) {}

  public save() {
    if (!this.form.valid) return;

    console.log({ form: this.form.value });
  }
}
