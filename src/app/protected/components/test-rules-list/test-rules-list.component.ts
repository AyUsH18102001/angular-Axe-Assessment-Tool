import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-rules-list',
  templateUrl: './test-rules-list.component.html',
  styleUrls: ['./test-rules-list.component.css']
})
export class TestRulesListComponent {
  constructor(){

  }

  @Input()
  rules : {
    display:string,
    shortName:string
  }[] = [];

}
