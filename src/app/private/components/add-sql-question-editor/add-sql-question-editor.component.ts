import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AdminAddSqlQuestion } from 'src/models/adminAdSqlQuestion';
import { TableSchemas } from 'src/models/tableSchemas';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-sql-question-editor',
  templateUrl: './add-sql-question-editor.component.html',
  styleUrls: ['./add-sql-question-editor.component.css']
})
export class AddSqlQuestionEditorComponent implements AfterViewInit, OnDestroy {

  editMode : boolean = false;
  constructor(private adminService:AdminService){
    const sqlQuestionId = sessionStorage.getItem('sqlQuestionId');
    if (sqlQuestionId != null) {
      // get the sql question
      this.adminService.getSqlQuestionById_EditSql(Number(sqlQuestionId)).subscribe((res)=>{
        this.addSqlQuestion = res;
        this.editMode = true;
      });
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('sqlQuestionId');
  }

  ngAfterViewInit(): void {
    this.getTableSchemas()
  }

  addSqlQuestion : AdminAddSqlQuestion = {
    questionContent : '',
    questionTitle:'',
    sqL_Answer : {
      query : ''
    }
  }

  tableSchemas : TableSchemas[] = [];


  addQuestion(){
    if (this.addSqlQuestion.questionContent === '' || this.addSqlQuestion.sqL_Answer.query === '') {
      this.snackBarContent = "All the fields are required";
      this.showSnackbar('red','whitesmoke');
     return; 
    }
    this.adminService.addSqlQuestion(this.addSqlQuestion).subscribe((res:any)=>{
      if (res.message == "success") {
        this.snackBarContent = "SQL Question added successfully";
        this.showSnackbar('green','whitesmoke');
      }
      else{
        this.snackBarContent = "Error ocurred while adding question";
        this.showSnackbar('red','whitesmoke');
      }
    },(error)=>{   
      this.snackBarContent = error;   
      this.showSnackbar('red','whitesmoke');
    });
  }

  snackBarContent : string = ''
  showSnackbar(backgroundColor:string, fontColor:string){
    const x = document.getElementById("snackbar")!;
    x.className = "show";
    x.style.background = backgroundColor;
    x.style.color = fontColor;
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  showModal() {
    document.getElementById('myModal-tables')!.style.display = 'block';
    document.getElementById('editor')!.style.display = 'none';
  }

  removeModal() {
    document.getElementById('myModal-tables')!.style.display = 'none';
    document.getElementById('editor')!.style.display = 'block';
  }

  // get the table schemas
  getTableSchemas(){
    this.adminService.getTableSchemas().subscribe((res)=>{
      this.tableSchemas = res;
      console.log(res);
      
    });
  }

  updateQuestion(){
    // update the question
    this.adminService.updateSqlQuestion(this.addSqlQuestion.questionId!,this.addSqlQuestion).subscribe((res:any)=>{
      if (res.message == "success") {
        this.snackBarContent = "SQL Question Updated Successfully"
        this.showSnackbar('green','whitesmoke');
      }
    });
  }

}
