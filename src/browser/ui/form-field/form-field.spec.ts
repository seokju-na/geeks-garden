import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { cleanupIpc } from '../../testing/cleanup-ipc';
import { fastTestSetup } from '../../testing/fast-test-setup';
import { typeInElement } from '../../testing/type-in-element';
import { InputModule } from '../input/input-module';
import { FormFieldError } from './form-field-error';
import { FormFieldModule } from './form-field-module';


describe('browser.ui.formField', () => {
  const getDisplayedErrorDe = (fixture: ComponentFixture<any>): DebugElement | undefined =>
    fixture.debugElement
      .queryAll(By.directive(FormFieldError))
      .find(errorDe => (errorDe.componentInstance as FormFieldError).show);

  fastTestSetup();
  cleanupIpc();

  beforeAll(async () => {
    await TestBed
      .configureTestingModule({
        imports: [TestFormFieldModule],
      })
      .compileComponents();
  });

  describe('form field with input', () => {
    let fixture: ComponentFixture<FormFieldWithInputComponent>;
    let component: FormFieldWithInputComponent;

    let inputEl: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(FormFieldWithInputComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      inputEl = fixture.debugElement.query(
        By.css('#input'),
      ).nativeElement as HTMLInputElement;
    });

    it('should show only the first error.', () => {
      typeInElement(
        'Invalid string because it is too long and pattern not matched',
        inputEl,
      );
      fixture.detectChanges();

      const error = getDisplayedErrorDe(fixture);
      expect((error.componentInstance as FormFieldError).errorName).toEqual('maxlength');
    });
  });
});


@Component({
  template: `
    <gg-form-field>
      <label for="input" ggFormFieldLabel>Label</label>
      <input ggInput [formControl]="control" id="input">

      <gg-form-field-description>Description</gg-form-field-description>

      <gg-form-field-error errorName="required">Required</gg-form-field-error>
      <gg-form-field-error errorName="maxlength">Too long</gg-form-field-error>
      <gg-form-field-error errorName="pattern">Invalid format</gg-form-field-error>
    </gg-form-field>
  `,
})
class FormFieldWithInputComponent {
  control = new FormControl('', [
    Validators.required,
    Validators.maxLength(10),
    Validators.pattern(/^[\S]$/),
  ]);
}


@NgModule({
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    InputModule,
  ],
  declarations: [
    FormFieldWithInputComponent,
  ],
  exports: [
    FormFieldModule,
    FormFieldWithInputComponent,
  ],
})
class TestFormFieldModule {
}
