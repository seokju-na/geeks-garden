import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gg-spinner',
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'Spinner',
    '[class.Spinner--contrast]': 'contrast',
  },
})
export class Spinner {
  @Input() contrast = false;
}
