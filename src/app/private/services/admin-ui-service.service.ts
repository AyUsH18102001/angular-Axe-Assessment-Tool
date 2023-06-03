import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TestPaper } from 'src/models/testPaper';

@Injectable({
  providedIn: 'root'
})
export class AdminUiServiceService {

  constructor() { }

  private showOptioInput_Subject = new BehaviorSubject<boolean>(false);
  currentShowOptionInput : Observable<boolean> = this.showOptioInput_Subject.asObservable();

  private testPaperQuestionList_Subject =  new BehaviorSubject<TestPaper[]>([]);
  currentQuestions : Observable<TestPaper[]> = this.testPaperQuestionList_Subject.asObservable();

  private editRules_Subject =  new BehaviorSubject<boolean>(false);
  editRules : Observable<boolean> = this.editRules_Subject.asObservable();

  toggleInput(value:boolean){
    this.showOptioInput_Subject.next(value);
  }

  addQuestionsToTest(data:TestPaper){
    let questions : TestPaper[] = [];
    this.currentQuestions.subscribe((res)=>{
      questions = res;
    });
    questions.push(data);
    this.testPaperQuestionList_Subject.next(questions);
  }

  toggleEditRules(value:boolean){
    this.editRules_Subject.next(value);
  }


}
