import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, GridModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonToggleModule } from './button-toggle/button-toggle-module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox-module';
import { FormFieldModule } from './form-field/form-field-module';
import { IconModule } from './icon/icon-module';
import { InputModule } from './input/input-module';
import { RadioModule } from './radio/radio-module';

const UI_MODULES = [
  RadioModule,
  FormFieldModule,
  InputModule,
  IconModule,
  ButtonModule,
  ButtonToggleModule,
  CheckboxModule,
];

@NgModule({
  imports: [
    A11yModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    GridModule,
    ...UI_MODULES,
  ],
  exports: [
    A11yModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    GridModule,
    ...UI_MODULES,
  ],
})
export class UiModule {
}
