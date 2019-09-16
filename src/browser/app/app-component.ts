import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api-service';

@Component({
  selector: 'gg-app',
  template: 'Hello World!',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  constructor(private api: ApiService) {
    console.log(this.api.getPersistentUser());
  }

  ngOnInit() {
  }
}
