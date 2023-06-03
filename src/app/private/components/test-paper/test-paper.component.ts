import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TestPaper } from 'src/models/testPaper';
import { AdminService } from '../../services/admin.service';
import { faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Test } from 'src/models/test';
import { TestQuestion } from 'src/models/testQuestion';
import { TestRules } from 'src/models/testRules';
import { AdminUiServiceService } from '../../services/admin-ui-service.service';

@Component({
  selector: 'app-test-paper',
  templateUrl: './test-paper.component.html',
  styleUrls: ['./test-paper.component.css']
})
export class TestPaperComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private adminService: AdminService, private adminUiService: AdminUiServiceService, private router: Router) {
    
  }

  ngOnDestroy(): void {
    if (this.router.url == '/admin/addRules') {
      return;
    }
    this.questions = [];
    this.adminService.addQuestionsToTest(this.questions);
    this.resetTestPaper();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const questions = this.adminService.getQuestionsFromTest();
      if (questions.length == 0) {
        this.questions = JSON.parse(sessionStorage.getItem('testQuestions')!);
      }
      else{
        this.questions = this.adminService.getQuestionsFromTest();;
      }
      sessionStorage.removeItem('testQuestions');
    }, 200);
    const testName = sessionStorage.getItem('testName');
    if (testName != null) {
      this.testName = sessionStorage.getItem('testName')!;
    }
    else{
      this.testName = sessionStorage.getItem('editTest')!;
    }
  }

  @Output()
  createTestSnackbar = new EventEmitter();

  ngOnInit(): void {
    // check if the session storage has test quetions
    const check: boolean = sessionStorage.getItem('testQuestions') != null ? true : false;
    const questions: TestPaper[] = JSON.parse(sessionStorage.getItem('testQuestions')!);
    if (check && questions.length != 0) {
      this.questions = questions;
    }

    // if we have rules in session storage
    const editTestRules = sessionStorage.getItem('rules') != null ? true : false;
    const editTest = sessionStorage.getItem('editTest') != null ? true : false;
    const addTestRules =  sessionStorage.getItem('testRules') != null ? true : false;
    if (editTest && editTestRules) {
      this.addTest = false;
      this.editTest = true;
      setTimeout(() => {
        this.adminUiService.toggleEditRules(true);
      }, 100);
      return;
    }
    if (addTestRules) {
      // check if we have questions
      const check3: boolean = this.adminService.getQuestionsFromTest().length > 0 ? true : false;
      if (check3) {
        this.addTest = true;
      }
      else {
        sessionStorage.removeItem('testRules');
        this.addTest = false;
      }
    }

  }

  // icons
  delete = faTrash;
  add = faAdd

  @Input()
  questions: TestPaper[] = this.adminService.getQuestionsFromTest();

  addTest: boolean = false;
  editTest: boolean = false;
  testName: string = '';

  removeQuestion(id: number, testId: number) {
    this.adminService.removeQuestionFromTest(id);
    this.questions = this.adminService.getQuestionsFromTest();

    const element = document.getElementById(`question-${testId}-${id}`);
    if (element?.classList.contains('added')) {
      element?.classList.replace('added', 'question');
    }
  }

  addRules() {
    if (this.adminService.getQuestionsFromTest().length == 0) {
      const snackBarContent = {
        mssg: "Please add questions to Test",
        bg: 'red',
        color: 'whitesmoke'
      }
      return this.createTestSnackbar.emit(snackBarContent);
    }
    if (this.testName != null) {
      sessionStorage.setItem('testName', this.testName);
    } 
    // add the test questions to session storage
    const questions: TestPaper[] = this.adminService.getQuestionsFromTest();
    sessionStorage.setItem('testQuestions', JSON.stringify(questions));
    //navigate to the rules page
    this.router.navigate(['admin/addRules']);
  }

  createTest() {
    const creatorId = JSON.parse(sessionStorage.getItem('userId')!);
    const testData = this.getQuestionsAndRules();
    const data: Test = {
      testName: this.testName,
      testCreatedDate: new Date(),
      testCreator: creatorId,
      testQuestions: testData[0],
      testRules: testData[1],
      mcQ_Count: testData[2],
      sqL_Count: testData[3]
    }
    // validations
    if (this.validations(testData[0])) {
      this.adminService.createTest(data).subscribe((res) => {
        if (res.message) {
          const snackBarContent = {
            mssg: "Test Created Successfully",
            bg: 'green',
            color: 'whitesmoke'
          }
          return this.createTestSnackbar.emit(snackBarContent);
        }
        else {
          const snackBarContent = {
            mssg: "Error Ocurred, while creating test",
            bg: 'red',
            color: 'whitesmoke'
          }
          return this.createTestSnackbar.emit(snackBarContent);
        }
      });
    }
  }

  updateTest() {
    const creatorId = JSON.parse(sessionStorage.getItem('userId')!);
    const testData = this.getQuestionsAndRules();
    const testId = Number(sessionStorage.getItem("testId"));
    const data: Test = {
      testName: this.testName,
      testCreatedDate: new Date(),
      testCreator: creatorId,
      testQuestions: testData[0],
      testRules: testData[1],
      mcQ_Count: testData[2],
      sqL_Count: testData[3]
    }
    // validations
    if (this.validations(testData[0])) {
      
      this.adminService.updateTest(data,testId).subscribe((res:any) => {
        if (res.message) {
          const snackBarContent = {
            mssg: "Test Updated Successfully",
            bg: 'green',
            color: 'whitesmoke'
          }
          return this.createTestSnackbar.emit(snackBarContent);
        }
        else {
          const snackBarContent = {
            mssg: "Error Ocurred, while updating test",
            bg: 'red',
            color: 'whitesmoke'
          }
          return this.createTestSnackbar.emit(snackBarContent);
        }
      });
    }

  }

  // get test questions and testrules
  getQuestionsAndRules() {
    let result: any[] = [];
    const questions = this.adminService.getQuestionsFromTest();
    let rules = JSON.parse(sessionStorage.getItem('testRules')!);
    if (sessionStorage.getItem('rules') != null) {
      // we are updating the test
      rules = JSON.parse(sessionStorage.getItem('rules')!);
      rules.forEach((element:any) => {
        element.state = true;
      });
    }

    let testQuestions: TestQuestion[] = [];
    let sqlCount = 0;
    let aptitudeCount = 0;
    questions.forEach((element) => {
      if (element.short_name == "sql") {
        sqlCount = sqlCount + 1;
      }
      else {
        aptitudeCount = aptitudeCount + 1;
      }
      // get the test type short name
      const tq: TestQuestion = {
        questionId: element.id
      }
      testQuestions.push(tq);
    });

    let testRules: { rule: number; }[] = [];
    rules.forEach((element: TestRules) => {
      if (element.state) {
        let tr = {
          rule: element.ruleId
        }
        testRules.push(tr);
      }
    });
    result[0] = testQuestions;
    result[1] = testRules;
    result[2] = aptitudeCount;
    result[3] = sqlCount;
    return result;
  }

  validations(testData: any[]) {
    if (testData.length == 0) {
      const snackBarContent = {
        mssg: "Please add Questions to test",
        bg: 'red',
        color: 'whitesmoke'
      }
      return this.createTestSnackbar.emit(snackBarContent);
    }
    if (this.testName == '') {
      const snackBarContent = {
        mssg: "Please provide a test name",
        bg: 'red',
        color: 'whitesmoke'
      }
      return this.createTestSnackbar.emit(snackBarContent);
    }
    else {
      return true;
    }
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
    this.testName = '';
    this.adminService.flushQuestionsFromTest();
    this.addTest = false;

    // toggle the edit rules
    this.adminUiService.toggleEditRules(false);
  }
}
