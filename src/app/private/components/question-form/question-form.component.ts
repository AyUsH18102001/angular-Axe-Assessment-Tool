import { Component, OnInit } from '@angular/core';
import { AdminAllQuestion } from 'src/models/adminAllQuestion';
import { AdminService } from '../../services/admin.service';
import { faAdd,faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  private questionTiles!: HTMLCollectionOf<Element>;
  noSuchQuestionFound : boolean = false;

  constructor(private adminService:AdminService,private router:Router){
    const page = sessionStorage.getItem('qPage');
    if (page == null) {
      sessionStorage.setItem('qPage','1');
    }
    // getthe question page count
    this.adminService.getQuestionPageCount().subscribe((res)=>{
      this.pageCount = res;
    });
  }

  // Icons
  addIcon = faAdd;
  searchIcon = faSearch;
  filter = faFilter;

  questions : AdminAllQuestion[] = [];
  questionTypes : string[] = [];
  searchQuestion :string = '';

  pageCount : number = 0;

  ngOnInit(): void {
    // get all the questions
    this.getBatchOfQuestion();
    
    this.questionTiles = document.getElementsByTagName('app-question-banks-question');    
  }

  getBatchOfQuestion(){
    const page = JSON.parse(sessionStorage.getItem('qPage')!);
    this.adminService.getAllQuestions(page).subscribe((res)=>{
      this.questions = res;
      this.getQuestionTypes();
    });
  }

  showModal(){
    document.getElementById('myModal')!.style.display = 'block';
  }

  deleteQuestion(){
    const deleteId  = sessionStorage.getItem('deleteQuestion')!;
    const adminId  = sessionStorage.getItem('userId')!;
    this.adminService.deleteQuestion(Number(deleteId),Number(adminId)).subscribe((res)=>{
      if (res.message == "success") {
        this.getBatchOfQuestion();
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

  getQuestionTypes(){
    // update the questionType according to questionTypeId
    this.questions.forEach((element)=>{
      const id = element.questionTypeId;
      this.adminService.getQuestionType(Number(id)).subscribe((res:any)=>{
        element.questionTypeId = res.message;
      });
    });
  }

  addQuestion(){
    this.router.navigate(['/admin/addQuestion'])
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
