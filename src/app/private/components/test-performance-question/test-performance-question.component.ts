import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { Option } from 'src/models/option';
import { Question } from 'src/models/question';
import { QuestionAnswers } from 'src/models/questionAnswers';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-test-performance-question',
  templateUrl: './test-performance-question.component.html',
  styleUrls: ['./test-performance-question.component.css']
})
export class TestPerformanceQuestionComponent implements OnInit,AfterViewInit {
  constructor(private adminService:AdminService){

  }
  ngAfterViewInit(): void {
    // get the question by id
    this.adminService.getQuestionById(this.questionAnswer.questionId).subscribe((res)=>{
      this.question = res;

      // get the options
      this.adminService.getOptions(this.questionAnswer.questionId).subscribe((res)=>{
        let options = res;
        options.forEach((element: Option,index:number) => {          
          if (element.score == 0) {
            this.options.push(element.option);
          }
          else{
            this.correctOption.push(element.option);
            this.correctOptionIndex.push(index);
          }
        });
        this.marksUserAnswer();
      });
    });
  }
  ngOnInit(): void {
  }



  @Input()
  questionAnswer! : QuestionAnswers
  @Input()
  questionNo : number = -1;

  options : string[] = [];
  correctOption : string[] = [];
  correctOptionIndex : number[] = [];

  optionNumber : string[] =  ['🅐','🅑','🅒','🅓'];

  question! : AdminAddQuestion;

  marksUserAnswer(){
    // get all the options elements
    const optionsElem = document.getElementsByClassName(`option-${this.questionAnswer.questionId}`);
   
    if (this.question.questionTypeId <= '2') { // i.e. question is not multiple select            
      if (this.questionAnswer.options[0] === this.correctOptionIndex[0]) {
        optionsElem[this.correctOptionIndex[0]].classList.add('correct');
      }
      else{
        optionsElem[this.questionAnswer.options[0]].classList.add('wrong');
      }
    }
    else{      
      this.questionAnswer.options.forEach((element:number,index:number)=>{
        if (this.correctOptionIndex.includes(element)) {
          optionsElem[element].classList.add('correct');
        }
        else{
          optionsElem[element].classList.add('wrong');
        }
      });
    }
  }

}
