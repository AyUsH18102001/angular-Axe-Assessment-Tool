import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestPaper } from 'src/models/testPaper';
import { AdminUiServiceService } from '../../services/admin-ui-service.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.css']
})
export class EditTestComponent implements OnInit,OnDestroy {
  constructor(private adminService:AdminService,private adminUiService:AdminUiServiceService,private router:Router){

  }

  ngOnDestroy(): void {
    if (this.router.url == '/admin/addRules') {
      return;
    }
    this.resetTestPaper();
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

  resetTestPaper() {
    // clear the session storage data and test data
    if (sessionStorage.getItem('testQuestions') != null) {
      sessionStorage.removeItem('testQuestions');
    }
    if (sessionStorage.getItem('testName') != null) {
      sessionStorage.removeItem("testName");
    }
    if (sessionStorage.getItem('testRules') != null) {
      sessionStorage.removeItem('testRules');
    }
    if (sessionStorage.getItem('rules') != null) {
      sessionStorage.removeItem('rules');
    }
    if (sessionStorage.getItem('editTest') != null) {
      sessionStorage.removeItem('editTest');
    }
    if (sessionStorage.getItem('testId') != null) {
      sessionStorage.removeItem('testId');
    }
    // flush questions
    this.questions = [];
    this.adminService.flushQuestionsFromTest();

    // toggle the edit rules
    this.adminUiService.toggleEditRules(false);
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
