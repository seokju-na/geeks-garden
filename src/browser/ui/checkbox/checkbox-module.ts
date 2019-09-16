import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Checkbox } from './checkbox';

@NgModule({
  imports: [
    A11yModule,
    ObserversModule,
    CommonModule,
  ],
  declarations: [
    Checkbox,
  ],
  exports: [
    Checkbox,
  ],
})
export class CheckboxModule {
}
