import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Input } from './input';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    Input,
  ],
  exports: [
    Input,
  ],
})
export class InputModule {
}
