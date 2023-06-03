import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminAllQuestion } from 'src/models/adminAllQuestion';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-question-banks-question',
  templateUrl: './question-banks-question.component.html',
  styleUrls: ['./question-banks-question.component.css']
})
export class QuestionBanksQuestionComponent implements OnInit{
  constructor(private router:Router,private adminService:AdminService){

  }
  ngOnInit(): void {
  }

  editIcon = faEdit;
  delete = faTrash;

  @Input()
  question! : AdminAllQuestion;

  @Output()
  deleteQuestionHndler  = new EventEmitter();

  goEditPage(){
    this.router.navigate(['/admin/editQuestion']);
    //also save the questionId to sessionStorage
    sessionStorage.setItem('questionId',this.question.questionId.toString());

    // the below method was a Subject used to traverse data to editQuestion component
    // this.adminService.addQuestionId(this.question.questionId);
  }

  onDeleteQuestion(questionId:number){
    sessionStorage.setItem('deleteQuestion',questionId.toString());
    return this.deleteQuestionHndler.emit();
  }


}
