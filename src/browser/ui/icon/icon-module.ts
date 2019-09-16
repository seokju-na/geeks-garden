import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Icon } from './icon';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    Icon,
  ],
  exports: [
    Icon,
  ],
})
export class IconModule {
}
