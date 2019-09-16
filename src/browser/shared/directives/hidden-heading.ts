import { Directive } from '@angular/core';

@Directive({
  selector: '[ggHiddenHeading]',
  host: {
    class: 'cdk-visually-hidden',
  },
})
export class HiddenHeading {
}
