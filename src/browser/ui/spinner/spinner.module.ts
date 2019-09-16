import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Spinner } from './spinner';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [Spinner],
  exports: [Spinner],
})
export class SpinnerModule {
}
