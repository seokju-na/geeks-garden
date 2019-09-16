import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';

type IconColor = 'none' | 'primary';

@Component({
  selector: 'gg-icon',
  template: ``,
  styleUrls: ['./icon.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'Icon',
    '[class.Icon--size-big]': 'bigSize',
    '[class.Icon--color-primary]': 'color === "primary"',
    role: 'img',
  },
})
export class Icon {
  @Input() bigSize = false;

  private _iconName: string;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.hostElement.classList.add('ri-1x');
  }

  @Input()
  get name() {
    return this._iconName;
  }

  set name(name: string) {
    this.updateIconClass(name);
  }

  @Input() color: IconColor = 'none';

  get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private updateIconClass(name: string): void {
    if (this._iconName && this.hostElement.classList.contains(`remixicon-${this._iconName}`)) {
      this.hostElement.classList.remove(`remixicon-${this._iconName}`);
    }

    this.hostElement.classList.add(`remixicon-${name}`);
    this._iconName = name;
  }
}
