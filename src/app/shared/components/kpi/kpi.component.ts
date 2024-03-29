import { Component, Input } from '@angular/core';
import { Currency } from '../../types';

@Component({
  selector: 'sb-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
})
export class KpiComponent {
  @Input()
  public name!: string;

  @Input()
  public value!: number;

  @Input()
  public type!: 'currency' | 'percentage';

  @Input()
  public currency: Currency = 'USD';
}
