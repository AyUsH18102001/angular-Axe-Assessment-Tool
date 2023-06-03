import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  constructor(){

  }
  @Input()
  options : string[] = [];
  @Input()
  questionId : number = 0;
  @Input()
  questionType : string = '';
  
  // options : string[] = ['200','225','245','250'];
  optionNumber : string[] =  ['🅐','🅑','🅒','🅓'];

  log(){
    
  }
}
