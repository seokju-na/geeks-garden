import { Component, OnInit } from '@angular/core';
import { environment } from '../../core/environment';
import { SomeService } from './some-service';

@Component({
  selector: 'gg-app',
  template: 'Hello World!',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  constructor(private some: SomeService) {
  }

  ngOnInit() {
    console.log(environment.version, environment.production);
    this.some.hello();
  }
}
