import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { QuestionAttempted } from 'src/models/questionAttempted';
import { SQL_Question } from 'src/models/sqlQuestion';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-test-performance-sql-question',
  templateUrl: './test-performance-sql-question.component.html',
  styleUrls: ['./test-performance-sql-question.component.css']
})
export class TestPerformanceSqlQuestionComponent implements OnInit,AfterViewInit {
  constructor(private adminService:AdminService){

  }
  ngAfterViewInit(): void {    
    // get the question by id
    this.adminService.getSqlQuestionById(this.sqlQuestion.questionId).subscribe((res)=>{
      this.question = res;      
    });
  }
  ngOnInit(): void {
  }

  @Input()
  sqlQuestion! : QuestionAttempted;
  @Input()
  questionNo : number = 0;

  
  question! : SQL_Question;
  

}
