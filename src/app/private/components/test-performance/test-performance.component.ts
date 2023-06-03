import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CandidateModel } from 'src/models/adminCandidateModel';
import { QuestionAnswers } from 'src/models/questionAnswers';
import { QuestionAttempted } from 'src/models/questionAttempted';
import { AdminService } from '../../services/admin.service';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';



@Component({
  selector: 'app-test-performance',
  templateUrl: './test-performance.component.html',
  styleUrls: ['./test-performance.component.css']
})

export class TestPerformanceComponent implements OnInit {
  constructor(private authService: AuthService, private adminService: AdminService, private router: Router) {

  }

  //Icons
  pdf = faFilePdf;

  id: number = 0;
  userData!: CandidateModel;
  questionsAttempted: QuestionAttempted[] = [];
  sqlQuestions: QuestionAttempted[] = [];
  questionsId: number[] = [];
  clubQuestions: QuestionAnswers[] = [];

  selectionStatus: boolean = false;

  tests: { testId: number, testName: string }[] = [];
  testName: string = '';

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('candidateId'));
    // get the test name
    this.adminService.getCandidatesTestName(this.id).subscribe((res) => {
      this.testName = res.message;
      console.log('testName = ', this.testName);
      
    });

    // get the user by id
    this.authService.getUserById(this.id).subscribe((res) => {
      this.userData = res;

      if (this.userData.selectionStatus == 1) {
        this.selectionStatus = true;
      }
      else {
        this.selectionStatus = false;
      }
      this.questionsAttempted = res.questionAttempted;

      if (this.userData.userTest.endTest) {
        this.questionsAttempted = this.questionsAttempted.filter((element) => {
          if (element.sqlQuery == null) {
            return element;
          }
          this.sqlQuestions.push(element);
          return;
        });
      }
      return;
    });

    // get the test names
    this.adminService.getAllTests().subscribe((res) => {
      this.tests = res;
    });
  }

  toggleStatus() {
    this.selectionStatus = !this.selectionStatus;
    if (this.userData.userTest.endTest) {
      this.setSlelectionStatus();
    }
  }

  testId: number = 0;
  assignTest() {
    // get the assign Test Data
    const candidateId = JSON.parse(sessionStorage.getItem("candidateId")!);
    const data = {
      testId: this.testId,
      userId: candidateId
    }
    this.adminService.assignCandidateTest(data).subscribe((res: any) => {
      //show snackbar
      if (res.message == "success") {
        this.snackBarContent = "Test Assigned Successfully";
        this.showSnackbar('green', 'whitesmoke');
        return;
      }
    });
  }

  setSlelectionStatus() {
    this.id = Number(sessionStorage.getItem('candidateId'));
    let state: number = 0;
    this.selectionStatus ? state = 1 : state = -1;
    this.adminService.updateSelectionStatus(this.id, state).subscribe((res: any) => {
      if (res.message == 'success') {
        this.snackBarContent = "Candidate profile updated successfully";
        this.showSnackbar('green', 'whitesmoke');
      }
      else {
        this.snackBarContent = "Error occured";
        this.showSnackbar('red', 'whitesmoke');
      }
    });
  }

  generateCandidateReport() {
    this.router.navigate(['/admin/candidateReport']);
  }



  snackBarContent: string = ''
  showSnackbar(backgroundColor: string, fontColor: string) {
    const x = document.getElementById("snackbar")!;
    x.className = "show";
    x.style.background = backgroundColor;
    x.style.color = fontColor;
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }
}
