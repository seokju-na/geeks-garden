import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RadioButton, RadioGroup } from './radio';

@NgModule({
  imports: [
    A11yModule,
    CommonModule,
  ],
  declarations: [
    RadioGroup,
    RadioButton,
  ],
  exports: [
    RadioGroup,
    RadioButton,
  ],
})
export class RadioModule {
}
