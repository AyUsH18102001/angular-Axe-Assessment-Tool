import { Component,Input, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
import { Question } from 'src/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(){
  }

  hasImage : boolean = true;

  ngOnInit(): void {
    
  }

  @Input()
  question! : Question;
  @Input()
  questionNumber! : number

}
