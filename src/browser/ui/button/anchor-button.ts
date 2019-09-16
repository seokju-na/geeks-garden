import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { ButtonBase } from './button-base';

@Component({
  selector: 'a[gg-button], a[gg-icon-button], a[gg-flat-button]',
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex || 0)',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
  },
})
export class AnchorButton extends ButtonBase<HTMLAnchorElement> {
  @Input() disabled = false;

  /** Tabindex of the button. */
  @Input() tabIndex: number;

  constructor(
    elementRef: ElementRef<HTMLAnchorElement>,
    focusMonitor: FocusMonitor,
  ) {
    super(elementRef, focusMonitor);
  }

  @HostListener('click', ['$event'])
  haltDisabledEvents(event: Event): void {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
