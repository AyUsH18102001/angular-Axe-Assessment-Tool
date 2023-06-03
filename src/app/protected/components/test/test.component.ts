import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
import { Question } from 'src/models/question';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { SubmitSqlQuery } from 'src/models/submitSqlQuery';
import { RunQuery } from 'src/models/runQuery';
import { SqlResponse } from 'src/models/sqlResponse';
import { AdminAddSqlQuestion } from 'src/models/adminAdSqlQuestion';

// ace editor imports
import * as ace from "ace-builds";
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-noconflict/ext-language_tools';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private testService: TestService, private router: Router,) {

  }

  ngOnDestroy(): void {
    // clear all the session data
    sessionStorage.clear();
  }

  @ViewChild("editor") private editor!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {

    const rulesArray = this.shouldRulesApply();
    this.showSqlResultMessages = rulesArray[2];
    this.terminateCandidate = rulesArray[1];

    if (this.currentQuestion >= this.mcqQuestionStart) {
      this.sqlProblem = this.sqlQuestions[(this.currentQuestion - this.mcqQuestionStart)];
      this.showSqlFrame = true;
      const query = this.setTheSqlQuery();
      setTimeout(() => {
        this.setCodeEditor(query);
        document.getElementById("outputContainer")!.innerHTML = '';
      }, 200);
    }
    else {
      this.showSqlFrame = false;
    }

    setTimeout(() => {
      if (!this.noAptitude) {
        this.setQuestionBlobs(false);
      }
    }, 200);

    setTimeout(() => {
      JSON.parse(sessionStorage.getItem("sqlAttempted")!).length == 0 ? null :
        this.setQuestionBlobs(true);
    }, 200);

    setTimeout(() => {
      const currentQuestionId = Number(sessionStorage.getItem('currentQuestion'));
      if (currentQuestionId < this.mcqQuestionStart) {
        // set the options
        this.setTheOptions();
      }
    }, 120);

    // asuming that the test only has aptitude questions and the candidate has at the last question

    // highlight the current question
    this.highlightQuestion(this.currentQuestion);
  }

  // icons
  leftArrow = faArrowLeft;
  rightArrow = faArrowRight;

  currentQuestion: number = 0;

  questions: Question[] = [];
  sqlQuestions: AdminAddSqlQuestion[] = [];

  userEmail: string = '';

  questionCount: number = 0;
  noAptitude: boolean = false;

  mcqQuestionStart: number = 0;
  showSqlFrame: boolean = false;
  userQuery: string = '';
  errorOutput: boolean = false;
  responseFetched: boolean = false;
  sqlProblem!: AdminAddSqlQuestion;
  noSql: boolean = false;
  review: boolean = false;

  reviewAptitude : boolean = false;
  reviewWithSql: boolean = false;

  testName: string = '';
  questionsDummy: number[] = [];
  outputSet : string = '';

  terminateCandidate : boolean = false;
  showSqlResultMessages: boolean = false;

  ngOnInit(): void {
    // disable the back button
    history.pushState(null, '');

    // get the aptitude and sql questions
    this.questions = JSON.parse(sessionStorage.getItem('aptitudeQuestions')!);
    if (this.questions.length == 0) {
      this.noAptitude = true;
    }
    this.sqlQuestions = JSON.parse(sessionStorage.getItem('sqlQuestions')!);
    if (this.sqlQuestions.length == 0) {
      this.noSql = true;
    }

    this.questionCount = this.questions.length;

    // test information
    this.testName = sessionStorage.getItem('testName')!;
    this.questionsDummy = Array(Number(sessionStorage.getItem('totalQuestions')!)).fill(0);
    this.mcqQuestionStart = Number(sessionStorage.getItem('mcqQuestionStart')!)

    // get the test data i.e. questions and other information
    this.currentQuestion = Number(sessionStorage.getItem('currentQuestion')!);

    // set the email and currentQuestion
    this.userEmail = sessionStorage.getItem('userEmail')!;
  }

  showModal() {
    // hide the questions navigation
    document.getElementById('navigation')!.style.display = 'none';

    document.getElementById('myModal')!.style.display = 'block';
  }

  removeModal() {
    // show the questions navigation
    document.getElementById('navigation')!.style.display = 'flex';

    document.getElementById('myModal')!.style.display = 'none';
  }

  submitShow() {
    // hide the questions navigation
    document.getElementById('navigation')!.style.display = 'none';

    document.getElementById('submitModal')!.style.display = 'block';
  }

  closeSubmitModal() {
    // show the questions navigation
    document.getElementById('navigation')!.style.display = 'flex';

    document.getElementById('submitModal')!.style.display = 'none';
  }

  isLastQuestion(i: number) {
    return i != this.questions.length - 1;
  }

  //highlight currentQuestion
  highlightQuestion(questionIndex: number) {
    const blobs = document.getElementsByClassName('questionBlob');
    for (let i = 0; i < blobs.length; i++) {
      if (i == questionIndex && (!blobs[i].classList.contains("questionAttempted") && !blobs[i].classList.contains("questionSkipped"))) {
        blobs[questionIndex].classList.add("questionSeek");
      }
      else {
        blobs[i].classList.remove("questionSeek");
      }
    }
  }

  // set the ace editor
  setCodeEditor(query: string) {
    ace.config.set("fontSize", "15px");
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.6/src-noconflict');
    const aceEditor = ace.edit(this.editor.nativeElement);
    if (query == '') {
      aceEditor.session.setValue(" \n\n -- Enter your query here \n\n");
    }
    else {
      aceEditor.session.setValue(query);
    }
    aceEditor.setOptions({
      showLineNumbers: true,
      tabSize: 2,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    aceEditor.setTheme('ace/theme/sqlserver');
    aceEditor.session.setMode('ace/mode/sql');

    aceEditor.on("change", () => {
      this.userQuery = aceEditor.getValue();
    });
  }

  attemptedAllQuestions() {
    // assuming test only has aptitude questions
    if (this.noSql) {
      // has the candidate attempted all the questions
      const attempted = JSON.parse(sessionStorage.getItem('questionsAttempted')!);
      for (let index = 0; index < attempted.length; index++) {
        const element = attempted[index];
        if (element["selectedOption"].length == 0) {
          this.review = true;
          break;
        }
        else {
          this.noSql = true;
          this.review = false;
        }
      }
    }
    else {
      // since the test has both aptitude as well as mcq questions

      // we have to check both aptitude list as well as sql list
      const aptitude = JSON.parse(sessionStorage.getItem('questionsAttempted')!);
      const sql = JSON.parse(sessionStorage.getItem('sqlAttempted')!);

      if (!this.noAptitude) {
        if (aptitude != null) {
          for (let index = 0; index < aptitude.length; index++) {
            const element = aptitude[index];
            if (element["selectedOption"].length == 0) {
              this.reviewAptitude = true;
              break;
            }
            else {
              this.reviewAptitude = false;
            }
          }
        }
      }

      if (this.currentQuestion >= this.mcqQuestionStart) {
        if (sql != null) {
          for (let index = 0; index < sql.length; index++) {
            const element = sql[index];
            if (!element["query"].includes('select')) {
              this.reviewWithSql = true;
              break;
            }
            else {
              this.reviewWithSql = false;
            }
          }
        }
      }
    }
  }

  reviewTest() {
    // go to the first question
    this.goToQuestion(0);
    // show snackbar to alert the candidate about the unattempted questions
    this.snackBarContent = "Please Attempt all the questions";
    this.showSnackbar('red', 'whitesmoke');
  }

  sqlSection() {
    this.currentQuestion = this.mcqQuestionStart;
    sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
    this.showSqlFrame = true;
    this.sqlProblem = this.sqlQuestions[this.currentQuestion - this.mcqQuestionStart];
    setTimeout(() => {
      this.setCodeEditor('');
      document.getElementById("outputContainer")!.innerHTML = '';
    }, 200);
    this.highlightQuestion(this.currentQuestion)
  }

  endTest() {
    this.testService.endTest().subscribe((res: any) => {
      if (res.message == "success") {
        this.removeModal();
        this.router.navigate(['/axe_assessment/thankyou']);
      }
    });
  }

  prevLook() {
    if (this.currentQuestion > 0) {
      this.currentQuestion = this.currentQuestion - 1;
      if (this.currentQuestion >= this.mcqQuestionStart) {
        this.showSqlFrame = true;
        this.responseFetched = false;
        this.errorOutput = false;
        this.sqlProblem = this.sqlQuestions[(this.currentQuestion - this.mcqQuestionStart)];
        const query = this.setTheSqlQuery();

        setTimeout(() => {
          this.setCodeEditor(query);
          document.getElementById("outputContainer")!.innerHTML = '';
        }, 200);
        sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
        if (!this.noAptitude) {
          this.setQuestionBlobs(false);
        }
        this.attemptedAllQuestions();
      }
      else {
        this.showSqlFrame = false;
        sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
        setTimeout(() => {
          this.setTheOptions();
        }, 50);
        if (!this.noAptitude) {
          this.setQuestionBlobs(false);
        }
        this.attemptedAllQuestions();
      }
    }
    setTimeout(() => {
      this.goToQuestion(this.currentQuestion);
    }, 180);
  }

  nextLook(setOption: boolean) {
    if (this.currentQuestion < this.questionsDummy.length - 1) {
      this.currentQuestion = this.currentQuestion + 1;
      if (this.currentQuestion >= this.mcqQuestionStart) {
        this.showSqlFrame = true;
        this.responseFetched = false;
        this.errorOutput = false;
        this.sqlProblem = this.sqlQuestions[(this.currentQuestion - this.mcqQuestionStart)];
        const query = this.setTheSqlQuery();
        setTimeout(() => {
          this.setCodeEditor(query);
        }, 200);
        document.getElementById("outputContainer")!.innerHTML = '';
        sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
        if (!this.noAptitude) {
          this.setQuestionBlobs(false);
        }
        this.attemptedAllQuestions();
      }
      else {
        this.showSqlFrame = false;
        sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
        if (this.currentQuestion < this.mcqQuestionStart) {
          setOption ? setTimeout(() => {
            this.setTheOptions();
          }, 50) : null;
        }
        setTimeout(() => {
          this.setTheOptions();
        }, 200);
        if (!this.noAptitude) {
          this.setQuestionBlobs(false);
        }
        this.attemptedAllQuestions();
      }
    }
    if (this.currentQuestion == this.questionsDummy.length) {
      // toggle end test button to submit test
      this.testService.toggleSubmitTestFlag(true);
    }
    setTimeout(() => {
      this.goToQuestion(this.currentQuestion);
    }, 180);
  }

  goToQuestion(index: number) {
    this.currentQuestion = index;
    this.sqlProblem = this.sqlQuestions[index - this.mcqQuestionStart];
    //highlight blob
    this.highlightQuestion(index);
    if (index >= this.mcqQuestionStart) {
      this.showSqlFrame = true;
      const query = this.setTheSqlQuery();
      setTimeout(() => {
        this.setCodeEditor(query);
        document.getElementById("outputContainer")!.innerHTML = '';
      }, 200);
      sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
      if (!this.noAptitude) {
        this.setQuestionBlobs(false);
      }
      this.attemptedAllQuestions();
      return;
    }
    else {
      this.showSqlFrame = false;
      this.errorOutput = false;
      this.responseFetched = false;
      sessionStorage.setItem('currentQuestion', this.currentQuestion.toString());
      setTimeout(() => {
        this.setTheOptions();
      }, 50);
      if (!this.noAptitude) {
        this.setQuestionBlobs(false);
      }
      this.attemptedAllQuestions();
      return;
    }
  }

  registerAnswer() {
    // get the currentQuestion
    const currentQuestion = this.currentQuestion;
    let editingCurrentQuestion = false;

    // get the selected option
    const options = document.getElementsByTagName(`li`);
    const selectedOption: any = [];

    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.classList.contains('active')) {
        selectedOption.push(index);
      }
    }

    // add it to the question Attempted field of user

    // add the data to session storage
    const object = {
      questionId: this.questions[currentQuestion].questionId,
      questionNo: currentQuestion,
      selectedOption: selectedOption
    }

    const violation = sessionStorage.getItem('violation');
    if (object.selectedOption.length == 0 && Number(violation)>3 && this.terminateCandidate) {
      return;
    }

    const sessionData: any[] = JSON.parse(sessionStorage.getItem('questionsAttempted')!);
    if (sessionData.length == 0) {
      sessionData.push(object);
      // set back to session storage
      sessionStorage.setItem('questionsAttempted', JSON.stringify(sessionData));
      // go to next question
      this.nextLook(false);
      if (!this.noAptitude) {
        this.setQuestionBlobs(false);
      }
      return;
    }

    // check if the question already attempted
    for (let index = 0; index < sessionData.length; index++) {
      if (sessionData[index].questionNo == currentQuestion) {
        sessionData[index].selectedOption = selectedOption;
        editingCurrentQuestion = true;
        break;
      }
      else {
        editingCurrentQuestion = false;
      }
    }
    if (!editingCurrentQuestion) {
      sessionData.push(object);
    }
    sessionStorage.setItem('questionsAttempted', JSON.stringify(sessionData));
    setTimeout(() => {
      if (!this.noAptitude) {
        this.setQuestionBlobs(false);
      }
    }, 100);
    this.nextLook(false);
  }

  // set the question blobs
  setQuestionBlobs(checkSQL: boolean) {
    // set the question blob status
    const blobs = document.getElementsByClassName('questionBlob');
    if (!checkSQL) {
      const qAttempted = JSON.parse(sessionStorage.getItem('questionsAttempted')!);
      if (qAttempted != null) {
        qAttempted.forEach((element: any) => {
          if (element["selectedOption"].length == 0) {
            if (blobs[element["questionNo"]].classList.contains("questionSkipped") && blobs[element["questionNo"]].classList.contains("questionAttempted")) {
              blobs[element["questionNo"]].classList.remove("questionAttempted");
            }
            else {
              blobs[element["questionNo"]].classList.add("questionSkipped");
            }
          }
          else if (element["selectedOption"].length > 0) {
            if (blobs[element["questionNo"]].classList.contains("questionSkipped") && blobs[element["questionNo"]].classList.contains("questionAttempted")) {
              blobs[element["questionNo"]].classList.remove("questionSkipped");
            }
            else {
              blobs[element["questionNo"]].classList.add("questionAttempted");
            }
          }
        }); 
      }
    }
    else {
      const sqlAttempted = JSON.parse(sessionStorage.getItem('sqlAttempted')!);
      if (sqlAttempted != null) {
        sqlAttempted.forEach((element: any) => {
          if (!element["query"].includes("select")) {
            if (blobs[element["id"]].classList.contains("questionAttempted")) {
              blobs[element["id"]].classList.remove("questionAttempted");
            }
            else {
              blobs[element["id"]].classList.add("questionSkipped");
            }
          }
          else {
            if (blobs[element["id"]].classList.contains("questionSkipped")) {
              blobs[element["id"]].classList.remove("questionSkipped");
            }
            else {
              blobs[element["id"]].classList.add("questionAttempted");
            }
          }
        });
      }
    }
  }

  setTheOptions() {
    // get the currentQuestion
    const currentQuestionIndex = this.currentQuestion;

    // check if the currentQuestion is attempted
    const data: any[] = JSON.parse(sessionStorage.getItem('questionsAttempted')!);
    if (data == null) {
      return;
    }
    // get the selected option
    const options = document.getElementsByTagName('li');

    data.forEach((element: any) => {
      if (element.questionNo == currentQuestionIndex) {
        // set the options        
        element.selectedOption.forEach((option: number) => {
          options[option].classList.add('active');
          options[option].classList.remove('option');
        });
      }
    });
  }


  // sql frame functions
  runQuery() {
    const query: RunQuery = {
      questionId: this.sqlProblem.questionId!,
      query: this.userQuery
    }
    this.testService.runSqlQuery(query).subscribe((res: SqlResponse) => {
      this.responseFetched = true;
      // set the output container
      let output: SqlResponse = res;
      let message: string = output.message.message;

      if (message == "error") {
        this.errorOutput = true;
      }
      else if (message == "success") {
        this.errorOutput = false;
      }
      else if (message != "success" && message != "error") {
        this.errorOutput = true;
        document.getElementById("outputContainer")!.innerHTML = `<p style="padding-left: 12px; padding-right: 12px; opacity:0.7; color: #D11534; "> <b> ${message}</b> </p> \n`;
        return;
      }
      let html: string = ``;
      let rowData: string = '';
      output.result.forEach((element: string[]) => {
        const row: string[] = element;
        row.forEach((element: string) => {
          rowData += `${element}  `
        });
        html += `<p style="padding-left: 12px; padding-right: 12px; opacity:0.8"> <b> ${rowData}</b> </p> \n`;
        rowData = '';
      });
      document.getElementById("outputContainer")!.innerHTML = html;
    });
  }

  registerQuery() {
    const query = {
      id: this.currentQuestion,
      questionId: this.sqlProblem.questionId!,
      query: this.userQuery.toString(),
      result: !this.errorOutput
    }
    const violation = sessionStorage.getItem('violation'); 
    if (!this.userQuery.toString().includes('select') && Number(violation) && this.terminateCandidate) {
      return;
    }
    const sessionData: any[] = JSON.parse(sessionStorage.getItem('sqlAttempted')!);
    // is sessionData Empty
    if (sessionData.length == 0) {
      sessionData.push(query);
      // re-initialize the sql register
      sessionStorage.setItem('sqlAttempted', JSON.stringify(sessionData));
      this.setTheSqlQuestionBlob(query.query, this.currentQuestion);
      this.nextLook(false);
      return;
    }

    for (let index = 0; index < sessionData.length; index++) {
      const element = sessionData[index];
      // check if query id is already present
      if (query.questionId == element.questionId) {
        // update the query
        element.query = query.query;
        // re-initialize the sql register
        sessionStorage.setItem('sqlAttempted', JSON.stringify(sessionData));
        // next question
        this.setTheSqlQuestionBlob(query.query, this.currentQuestion);
        this.nextLook(false);
        // set the ouput set to empty
        document.getElementById("outputContainer")!.innerHTML = ``;
        return;
      }
    }
    sessionData.push(query);
    // re-initialize the sql register
    sessionStorage.setItem('sqlAttempted', JSON.stringify(sessionData));
    this.setTheSqlQuestionBlob(query.query, this.currentQuestion);
    this.nextLook(false);
    
    // set the ouput set to empty
    document.getElementById("outputContainer")!.innerHTML = ``;
    return;
  }

  setTheSqlQuestionBlob(query: string, id: number) {
    const blobs = document.getElementsByClassName('questionBlob');
    if (!query.toLocaleLowerCase().includes('select')) {
      if (blobs[id].classList.contains("questionAttempted")) {
        blobs[id].classList.remove("questionAttempted");
        blobs[id].classList.add("questionSkipped");
      }
      else{
        blobs[id].classList.add("questionSkipped");
      }
    }
    else {
      if (blobs[id].classList.contains("questionSkipped")) {
        blobs[id].classList.remove("questionSkipped");
        blobs[id].classList.add("questionAttempted");
      }
      else{
        blobs[id].classList.add("questionAttempted");
      }
    }
  }

  // submitTest
  submitTest(path: string) {
    this.closeSubmitModal();
    // submit the aptitude test
    this.submitAptitudeTest();

    setTimeout(() => {
      const aptitude = Number(sessionStorage.getItem('aptitudeUpdated'));
      const sql = Number(sessionStorage.getItem('sqlUpdated'));
      if (aptitude == 1 && sql == 1) {
        this.router.navigate([`/axe_assessment/${path}`]);
      }
    }, 1000);
  }

  // submit aptitude test
  submitAptitudeTest() {
    this.closeSubmitModal();
    if (this.noSql) {
      this.registerAnswer();
    }
    const questionsAnswered = JSON.parse(sessionStorage.getItem('questionsAttempted')!);
    // create the TestSubmit object
    const testSubmit = {
      userId: Number(sessionStorage.getItem('userId')!),
      testPeriod: Number(sessionStorage.getItem('timePeriod')),
      violation: Number(sessionStorage.getItem('violation')),
      totalQuestions: questionsAnswered.length,
      candidatesQuestions: questionsAnswered
    }

    this.testService.submitTest(testSubmit).subscribe((res: any) => {
      if (res.message == "success") {
        sessionStorage.setItem('aptitudeUpdated', '1');
        if (this.noSql) {
          this.router.navigate(['/axe_assessment/thankyou']);
        }
        else {
          // submit sql test
          this.submitSqlTest('thankyou');
        }
      }
    });
  }

  // submit sql test
  submitSqlTest(path: string) {
    this.closeSubmitModal();
    this.registerQuery();
    const sql = JSON.parse(sessionStorage.getItem('sqlAttempted')!);
    if (sql.length == 0) {
      return;
    }
    const data: SubmitSqlQuery[] = []
    for (let index = 0; index < sql.length; index++) {
      const element = sql[index];
      const sqlQuestion: SubmitSqlQuery = {
        userId: Number(sessionStorage.getItem('userId')),
        questionId: element["questionId"],
        query: element["query"],
        result: element["result"]
      }
      data.push(sqlQuestion);
    }

    this.testService.submitSqlQuery(data).subscribe((res) => {
      if (res.message == "success") {
        sessionStorage.setItem('sqlUpdated', '1');        
        if (this.noAptitude) {
          this.router.navigate([`/axe_assessment/${path}`]);
        }
      }
    });
  }

  // when the candidate revesits the sql question the query must be there
  setTheSqlQuery() {
    if (JSON.parse(sessionStorage.getItem("sqlAttempted")!).length == 0) {
      return '';
    }
    // get the current question
    let question = JSON.parse(sessionStorage.getItem('sqlAttempted')!).filter((element: any) => {
      return element["id"] == this.currentQuestion;
    });
    if (question.length == 0) return '';
    return question[0].query;
  }

  snackBarContent: string = ''
  showSnackbar(backgroundColor: string, fontColor: string) {
    const x = document.getElementById("snackbar")!;
    x.className = "show";
    x.style.background = backgroundColor;
    x.style.color = fontColor;
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3500);
  }


  @HostListener("window:blur", ['$event'])
  @HostListener("window:resize", ['$event'])
  testModerator(event: any) {
    // rules => ['tab_switch','violation_terminate','show_sql_result']

    // get the violation
    this.violationIncrement();
    const rulesApply = this.shouldRulesApply();
    let violation = Number(sessionStorage.getItem('violation'));
    if (!rulesApply[0] && !rulesApply[1]) {
      this.violationIncrement();
      return;
    }
    if (rulesApply[0] || !rulesApply[1]) {
      this.violationIncrement();
      return;
    }
    if (!rulesApply[0] || rulesApply[1]) {
      this.violationAndTerminate(violation);
      return;
    }
    if (rulesApply[2]) {
      this.showSqlResultMessages = true;
      return;
    }
    if (!rulesApply[2]) {
      this.showSqlResultMessages = false;
      return;
    }
  }

  violationMessage: string = '';
  violationAndTerminate(violation: number) {
    if (violation == 1) {
      // make the candidate aware of the rules
      this.violationMessage = "Please follow the test rules, else you will be terminated from assessment";
      // hide the questions navigation
      document.getElementById('navigation')!.style.display = 'none';
      document.getElementById('violationModal')!.style.display = 'block';
    }
    if (violation == 3) {
      // candidate last warning
      this.violationMessage = `This is the last warning for you, 
      You will be terminated from the test and all the attempted questions are saved`;
      // hide the questions navigation
      document.getElementById('navigation')!.style.display = 'none';
      document.getElementById('violationModal')!.style.display = 'block';
    }
    if (violation > 3) {
      if (this.noAptitude) {
        this.submitSqlTest('terminated');
      }
      else {
        // terminate the candidate
        this.submitTest('terminated');
      }
    }
  }

  closeModal() {
    // show the questions navigation
    document.getElementById('navigation')!.style.display = 'flex';
    
    document.getElementById('violationModal')!.style.display = 'none';
  }

  violationIncrement() {
    sessionStorage.setItem('violation', (Number(sessionStorage.getItem('violation')) + 1).toString());
  }

  shouldRulesApply(): boolean[] {
    const rule_book = ['tab_switch', 'violation_terminate', 'show_sql_result'];
    let ruleApplied = Array(3).fill(false);

    let rule: any = sessionStorage.getItem('ruleBook')
    if (rule?.includes(',')) {
      let rules: string[] = sessionStorage.getItem('ruleBook')?.split(',')!;
      let i = 0;
      rule_book.forEach((element, index) => {
        if (element.includes(rules[i])) {
          ruleApplied[index] = true;
          i++;
        }
      });
    }
    else {
      // we have only one rule
      rule_book.forEach((element, index) => {
        if (element == rule) {
          ruleApplied[index] = true;
        }
      });
    }
    return ruleApplied;
  }
}
