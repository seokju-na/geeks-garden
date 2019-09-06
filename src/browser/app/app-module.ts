import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app-component';
import { SomeService } from './some-service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
  ],
  declarations: [AppComponent],
  providers: [SomeService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
