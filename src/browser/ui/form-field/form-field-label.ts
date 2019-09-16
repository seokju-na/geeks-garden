import { Directive } from '@angular/core';


/**
 * Label for form field.
 *
 * @example
 * <label ggFormFieldLabel for="someInput">Name:</label>
 * <gg-form-field>
 *     <input ggInput formControlName="some" id="someInput">
 * </gg-form-field>>
 */
@Directive({
  selector: 'label[ggFormFieldLabel]',
  host: {
    class: 'FormFieldLabel',
  },
})
export class FormFieldLabel {
}
