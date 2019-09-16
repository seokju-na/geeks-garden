import { FocusMonitor } from '@angular/cdk/a11y';
import { ElementRef, HostBinding, Input, OnDestroy } from '@angular/core';

export type ButtonColor = 'primary' | 'normal';

export const BUTTON_HOST_ATTRIBUTES = [
  'gg-button',
  'gg-icon-button',
  'gg-flat-button',
];

export const BUTTON_HOST_ATTRIBUTE_CLASS_NAME_MAP = {
  'gg-button': 'Button',
  'gg-icon-button': 'IconButton',
  'gg-flat-button': 'FlatButton',
};

export type ButtonIconContainsPosition = 'left' | 'right' | null;

export abstract class ButtonBase<T extends HTMLElement> implements OnDestroy {
  protected constructor(
    protected elementRef: ElementRef<T>,
    protected focusMonitor: FocusMonitor,
  ) {
    // For each of the variant selectors that is prevent in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this.hasHostAttributes(attr)) {
        this.hostElement.classList.add(BUTTON_HOST_ATTRIBUTE_CLASS_NAME_MAP[attr]);
      }
    }

    this.color = 'normal';
    this.focusMonitor.monitor(this.elementRef, true);
  }

  protected _color: ButtonColor;

  @Input()
  get color(): ButtonColor {
    return this._color;
  }

  set color(color: ButtonColor) {
    this.updateColorClassName(color);
  }

  /** Whether if show spinner. */
  @Input() showSpinner: boolean = false;

  /** Whether if focus hidden. */
  @Input() focusHidden: boolean = false;

  /** Icon contains position. */
  @Input() iconContains: ButtonIconContainsPosition = null;

  /** Whether if button is big size. */
  @Input() bigSize: boolean = false;

  @HostBinding('class.Button--showSpinner')
  get showSpinnerClass() {
    return this.showSpinner;
  }

  @HostBinding('class.Button--iconContains-left')
  get iconContainsLeftClass() {
    return this.iconContains === 'left';
  }

  @HostBinding('class.Button--iconContains-right')
  get iconContainsRightClass() {
    return this.iconContains === 'right';
  }

  @HostBinding('class.Button--size-big')
  get bigSizeClass() {
    return this.bigSize;
  }

  get hostElement(): T {
    return this.elementRef.nativeElement;
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  protected updateColorClassName(color: ButtonColor): void {
    const hostEl = this.hostElement;

    if (this._color) {
      const previousColorClassName = `Button--color-${this._color}`;

      // Remove previous button color class.
      if (hostEl.classList.contains(previousColorClassName)) {
        hostEl.classList.remove(previousColorClassName);
      }
    }

    const nextClassName = `Button--color-${color}`;

    hostEl.classList.add(nextClassName);

    this._color = color;
  }

  private hasHostAttributes(...attributes: string[]): boolean {
    return attributes.some(attribute => this.hostElement.hasAttribute(attribute));
  }
}
