import { Directive, ElementRef, HostListener, Input as InputProp, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { FormFieldControl } from '../form-field/form-field-control';

let uniqueId = 0;

@Directive({
  selector: 'input[ggInput], textarea[ggInput]',
  providers: [
    {
      provide: FormFieldControl,
      useExisting: Input,
    },
  ],
  host: {
    class: 'Input',
    '[attr.id]': 'id',
  },
})
export class Input extends FormFieldControl {
  private _id = `gg-input-${uniqueId++}`;

  @InputProp()
  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  constructor(
    @Self() public ngControl: NgControl,
    @Optional() public parentForm: FormGroupDirective,
    public elementRef: ElementRef,
  ) {
    super();
  }

  @HostListener('focus')
  handleFocus(): void {
    this.focused = true;
  }

  @HostListener('blur')
  handleBlur(): void {
    this.focused = false;
  }
}
