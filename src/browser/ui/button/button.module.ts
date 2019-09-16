import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule } from '../spinner/spinner.module';
import { AnchorButton } from './anchor-button';
import { Button } from './button';


@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    SpinnerModule,
  ],
  declarations: [
    Button,
    AnchorButton,
  ],
  exports: [
    Button,
    AnchorButton,
  ],
})
export class ButtonModule {
}
