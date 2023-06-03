import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/private/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test-disclaimer',
  templateUrl: './test-disclaimer.component.html',
  styleUrls: ['./test-disclaimer.component.css']
})
export class TestDisclaimerComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private adminService: AdminService, 
    private testService: TestService, private authService: AuthService) {

  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getTestData();
    }, 2000);
  }

  elem: any;
  rules: {
    display:string,
    shortName:string
  }[] = [];
  userId: number = 0;
  termsAndCond : any = false;


  ngOnInit(): void {
    // disable the back button
    history.pushState(null, '');

    // assign the DOM element
    this.elem = document.documentElement;
    // get the userId and userEmail
    this.authService.getUserEmailAndId().subscribe((res) => {
      this.userId = Number(res.userId);
      // get the test rules
      this.getRules(Number(res.userId));
      // initialize the userEmail and userId in the session storage
      sessionStorage.setItem('userEmail', res.email!);
      sessionStorage.setItem('userId', res.userId.toString());
    });

    // initialize the test questions array in the session storage
    const questionsArray: string = JSON.stringify([]);
    sessionStorage.setItem('questions', questionsArray);

    // initialize the question attempted register in session storage
    const questionsAttempted: string = JSON.stringify([]);
    sessionStorage.setItem('questionsAttempted', questionsAttempted);

    // initialize the sql query register in session storage
    const sqlAttempted: string = JSON.stringify([]);
    sessionStorage.setItem('sqlAttempted', questionsAttempted);

    // set the current aptitude question and current sql question
    sessionStorage.setItem('currentQuestion', '0');
    
  }

  getTestData(){
    // aptitude questions
    this.testService.testData(this.userId).subscribe((res) => {
      sessionStorage.setItem('aptitudeQuestions', JSON.stringify(res));
    });

    //sql question
    this.testService.getSqlTestData(this.userId).subscribe((res) => {
      sessionStorage.setItem('sqlQuestions', JSON.stringify(res));
    });

    // get the test information
    this.testService.getTestInformation(this.userId).subscribe((res) => {
      sessionStorage.setItem('testName', res.testName.toString());
      sessionStorage.setItem('mcqQuestionStart', res.mcqCount.toString());
      sessionStorage.setItem('totalQuestions', (res.mcqCount + res.sqlCount).toString());
    });

    //test violation
    sessionStorage.setItem('violation','0');
  }

  giveTest() {
    if (!this.termsAndCond) {
      return;
    }
    // check is the user has already given the test

    // get user by id
    const id = Number(sessionStorage.getItem("userId"));
    this.authService.getUserById(id).subscribe((res) => {
      if (res.userTest.endTest && res.violation >= 3) {
        sessionStorage.removeItem('questions');
        sessionStorage.removeItem('questionsAttempted');
        this.router.navigate(['/axe_assessment/terminated']);
      }
      if (res.userTest.endTest) {
        sessionStorage.removeItem('questions');
        sessionStorage.removeItem('questionsAttempted');
        this.router.navigate(['/axe_assessment/thankyou']);
      }
      if (res.violation >= 3) {
        sessionStorage.removeItem('questions');
        sessionStorage.removeItem('questionsAttempted');
        this.router.navigate(['/axe_assessment/terminated']);
      }
      else {
        this.router.navigate(['/axe_assessment/test']);
      }
    });
  }

  // get test rules
  getRules(userId: number) {
    let ruleBook:any[] = [];
    this.adminService.getTestRules(userId).subscribe((res) => {
      console.log(res); 
      res.forEach((element) => {
        this.rules.push({
          display:element.ruleDisplay,
          shortName:element.short_name
        });
      });
      ruleBook = this.rules.map((element)=>{
        return element.shortName;
      });
      sessionStorage.setItem('ruleBook',ruleBook.toString());
    });
  }

}


