import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonToggle, ButtonToggleGroup } from './button-toggle';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ButtonToggleGroup,
    ButtonToggle,
  ],
  exports: [
    ButtonToggleGroup,
    ButtonToggle,
  ],
})
export class ButtonToggleModule {
}
