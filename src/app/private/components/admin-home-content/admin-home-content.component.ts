import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestPaper } from 'src/models/testPaper';
import { AdminUiServiceService } from '../../services/admin-ui-service.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-home-content',
  templateUrl: './admin-home-content.component.html',
  styleUrls: ['./admin-home-content.component.css']
})
export class AdminHomeContentComponent implements OnInit{
  constructor(private adminService:AdminService,private adminUiService:AdminUiServiceService,private router:Router){

  }
  editRules : boolean = false;
  ngOnInit(): void {
    this.adminUiService.editRules.subscribe((res)=>this.editRules=res);
    // if we have rules in session storage
    const check = sessionStorage.getItem('testRules') != null ? true : false;
    if (check) {
      this.adminUiService.toggleEditRules(true);
      return;
    }
    else{
      this.adminUiService.toggleEditRules(false);
      return;
    }
  }

  @Input()
  firstName : string = '';
  @Input()
  lastName : string = '';


  questions : TestPaper[] = [];
  getTestData(){
    this.adminService.currentQuestions.subscribe((res)=>{
      this.questions = res;
    });
  }

  removeQuestionPanel(testId:number,questionId:number){
    const element =  document.getElementById(`question-${testId}-${questionId}`);
    if (element?.classList.contains('question')) {
      element?.classList.replace('question','added');
    }
  }

  togglePanel() {    
    const check1: boolean = sessionStorage.getItem('testQuestions') != null ? true : false;
    const check2: boolean = this.adminService.getQuestionsFromTest().length > 0 ? true : false;
    if (check1) {
      // removeQuestionPanel
      const questions: TestPaper[] = JSON.parse(sessionStorage.getItem('testQuestions')!);
      // removing the questions from the accordian 
      questions.forEach((element) => {
        console.log(element.testId, element.id);
        this.removeQuestionPanel(element.testId, element.id);
      });
    }
    if (check2) {
      // removeQuestionPanel
      const questions: TestPaper[] = this.adminService.getQuestionsFromTest();
      // removing the questions from the accordian 
      questions.forEach((element) => {
        this.removeQuestionPanel(element.testId, element.id);
      });
    }
  }

  goEditRules(){
    // add the test questions to session storage
    const questions : TestPaper[] = this.adminService.getQuestionsFromTest();
    sessionStorage.setItem('testQuestions',JSON.stringify(questions));
    // go to test rules
    this.router.navigate(['admin/addRules']);
  }

  snackbarEvent(snackbarContents:any){
    this.snackBarContent = snackbarContents.mssg;
    this.showSnackbar(snackbarContents.bg,snackbarContents.color);
    return;
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

