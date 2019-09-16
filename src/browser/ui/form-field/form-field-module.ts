import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormField } from './form-field';
import { FormFieldDescription } from './form-field-description';
import { FormFieldError } from './form-field-error';
import { FormFieldLabel } from './form-field-label';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FormField,
    FormFieldLabel,
    FormFieldError,
    FormFieldDescription,
  ],
  exports: [
    FormField,
    FormFieldLabel,
    FormFieldError,
    FormFieldDescription,
  ],
})
export class FormFieldModule {
}
