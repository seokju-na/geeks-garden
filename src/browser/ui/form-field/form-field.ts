import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { FormFieldControl } from './form-field-control';
import { FormFieldError } from './form-field-error';
import { FormFieldLabel } from './form-field-label';


@Component({
  selector: 'gg-form-field',
  templateUrl: './form-field.html',
  styleUrls: [
    './form-field.scss',
    './form-field-label.scss',
    './form-field-error.scss',
    './form-field-description.scss',
    '../input/input.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'FormField',
    '[class.FormField--invalid]': '_errorCaught',
    '[class.FormField--disabled]': '_control?.disabled',
    '[class.FormField--focused]': '_control?.focused',
  },
})
export class FormField implements AfterViewInit {
  @ContentChild(FormFieldControl, { static: false }) _control: FormFieldControl;
  @ContentChild(FormFieldLabel, { static: false }) _labelChild: FormFieldLabel;
  @ContentChildren(FormFieldError) _errorChildren: QueryList<FormFieldError>;

  private _errorCaught = false;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngAfterViewInit(): void {
    if (!this._control) {
      throw new Error('Form field control must be provided.');
    }

    this._control.statusChanges.subscribe(() => {
      this.validateError();
      this.changeDetector.markForCheck();
    });

    if (this._control.ngControl.dirty || this._control.ngControl.touched) {
      this.validateError();
      this.changeDetector.markForCheck();
    }
  }

  private validateError(): void {
    const formErrors = this._control.getErrors();

    // Reset error children.
    this._errorChildren.forEach(error => error.show = false);

    const targetError = this.selectFirstError(Object.keys(formErrors));

    if (targetError) {
      targetError.show = true;
      this._errorCaught = true;
    } else {
      this._errorCaught = false;
    }
  }

  private selectFirstError(errorNames: string[]): FormFieldError {
    return this._errorChildren.find(error => errorNames.includes(error.errorName));
  }
}
