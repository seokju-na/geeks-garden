import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { ButtonBase } from './button-base';


@Component({
    selector: 'button[gg-button], button[gg-icon-button], button[gg-flat-button]',
    templateUrl: './button.html',
    styleUrls: ['./button.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button extends ButtonBase<HTMLButtonElement> {
    constructor(
      elementRef: ElementRef<HTMLButtonElement>,
      focusMonitor: FocusMonitor,
    ) {
        super(elementRef, focusMonitor);
    }
}
