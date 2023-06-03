import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AdminAddSqlQuestion } from 'src/models/adminAdSqlQuestion';

@Component({
  selector: 'app-sql-bank-question',
  templateUrl: './sql-bank-question.component.html',
  styleUrls: ['./sql-bank-question.component.css']
})
export class SqlBankQuestionComponent implements OnInit {

  pageCount : number = 0;

  constructor(private adminService:AdminService,private router:Router){
    
  }

  ngOnInit(): void {
    // get all the sql questions
  }

  //Icons
  editIcon = faEdit;
  delete = faTrash;

  @Input()
  question! : AdminAddSqlQuestion;
  @Output()
  deleteQuestionHndler  = new EventEmitter();

  goEditPage(){
    this.router.navigate(['/admin/sqlQuestionEditor']);
    //also save the questionId to sessionStorage
    sessionStorage.setItem('sqlQuestionId',this.question.questionId!.toString());
  }

  onDeleteQuestion(questionId:number|undefined){
    sessionStorage.setItem('sqlDeleteQuestion',questionId!.toString());
    return this.deleteQuestionHndler.emit();
  } 

}
