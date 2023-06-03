import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAdd,faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { AdminAddSqlQuestion } from 'src/models/adminAdSqlQuestion';
import { SQL_Question } from 'src/models/sqlQuestion';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-sql-question-bank',
  templateUrl: './sql-question-bank.component.html',
  styleUrls: ['./sql-question-bank.component.css']
})
export class SqlQuestionBankComponent implements OnInit {
  pageCount : number = 0;

  constructor(private adminService:AdminService, private router:Router){
    const page = sessionStorage.getItem('sqlPage');
    if (page == null) {
      sessionStorage.setItem('sqlPage','1');
    }
    // get the question page count
    this.adminService.getSqlQuestionPageCount().subscribe((res)=>{
      this.pageCount = res;
    });
  }
  ngOnInit(): void {
    // get all the sql question
    this.getSqlBatchQuestion();
    
    this.questionTiles = document.getElementsByTagName('app-sql-bank-question');  
  }

  // Icons
  addIcon = faAdd;
  searchIcon = faSearch;
  filter = faFilter;

  questions : AdminAddSqlQuestion[] = [];
  searchQuestion :string = '';
  private questionTiles!: HTMLCollectionOf<Element>;
  noSuchQuestionFound : boolean = false;

  // get the batch of sql question
  getSqlBatchQuestion(){
    const page = JSON.parse(sessionStorage.getItem('sqlPage')!);
    this.adminService.getSQLQuestions(page).subscribe((res)=>{   
      this.questions = res;
    }); 
  }

  addQuestion(){
    this.router.navigate(['/admin/sqlQuestionEditor']);
  }

  onSearchChange(){
    const questionFound = [];    
    for (let index = 0; index < this.questionTiles.length; index++) {
      const content = this.questionTiles[index].children[0].children[0].textContent!;
      if (!content.toLocaleLowerCase().includes(this.searchQuestion.toLowerCase())) {
        this.questionTiles[index].setAttribute('class','hide');
      }
      else{
        questionFound.push(content);
        this.questionTiles[index].removeAttribute('class'); 
      }
    }
    if (questionFound.length == 0 && this.searchQuestion.length != 0) {
      this.noSuchQuestionFound = true;
    }
    else{
      this.noSuchQuestionFound = false;
    }
  }

  showModal(){
    document.getElementById('myModal')!.style.display = 'block';
  }

  deleteQuestion(){
    const deleteId = sessionStorage.getItem('sqlDeleteQuestion')!;
    const adminId = sessionStorage.getItem('userId')!;
    this.adminService.deleteSqlQuestion(Number(deleteId),Number(adminId)).subscribe((res)=>{
      if (res.message == "success") {
        this.getSqlBatchQuestion();
        this.snackBarContent = "Question deleted successfully";
        this.showSnackbar('green','whitesmoke');
      }
      else{
        this.snackBarContent = "Error occured while deleting question";
        this.showSnackbar('green','whitesmoke');
      }
      // remove modal
      this.removeModal();
    });
  }

  removeModal(){
    document.getElementById('myModal')!.style.display = 'none';
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

}
