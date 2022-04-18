import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-toggleable',
  templateUrl: './toggleable.component.html',
  styleUrls: ['./toggleable.component.scss'],
})
export class ToggleableComponent {
  public toggled = false;

  @Input()
  public mainLabel = 'my label';

  @Input()
  public altLabel = 'alt label';
}
