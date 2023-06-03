import { AfterViewInit, Component, Input } from '@angular/core';
import { QuestionAnswers } from 'src/models/questionAnswers';
import { QuestionAttempted } from 'src/models/questionAttempted';

@Component({
  selector: 'app-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.css']
})
export class TestSummaryComponent implements AfterViewInit{
  constructor(){

  }
  @Input()
  questionsAttempted: QuestionAttempted[] = [];
  @Input()
  sqlQuestions : QuestionAttempted[] = [];

  clubQuestions: QuestionAnswers[] = [];
  
  ngAfterViewInit(): void {
    for (let index = 0; index < this.questionsAttempted.length - 1; index++) {
      let options = [];
      if (this.questionsAttempted[index].questionId != this.questionsAttempted[index + 1].questionId) {
        // add an insance of questionAnswer
        const instance: QuestionAnswers = {
          questionId: this.questionsAttempted[index].questionId,
          options: [this.questionsAttempted[index].optionIndex]
        }
        this.clubQuestions.push(instance);
      }
      else {
        let i = index
        while (this.questionsAttempted[i].questionId == this.questionsAttempted[i + 1].questionId) {
          options.push(this.questionsAttempted[i].optionIndex);
          i++;
        }
        options.push(this.questionsAttempted[i].optionIndex);
        // add an insance of questionAnswer
        const instance: QuestionAnswers = {
          questionId: this.questionsAttempted[index].questionId,
          options: options
        }
        this.clubQuestions.push(instance);
        index = i;
      }
    }
    // adding the last question
    const instance: QuestionAnswers = {
      questionId: this.questionsAttempted[this.questionsAttempted.length - 1].questionId,
      options: [this.questionsAttempted[this.questionsAttempted.length - 1].optionIndex]
    }
    this.clubQuestions.push(instance);
    return;
  }


}
