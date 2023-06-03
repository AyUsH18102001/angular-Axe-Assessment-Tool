import { AfterViewInit, Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CandidateModel } from 'src/models/adminCandidateModel';
import { QuestionAttempted } from 'src/models/questionAttempted';
import { QuestionAnswers } from 'src/models/questionAnswers';
import { AdminService } from '../../services/admin.service';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-test-summary-pdf',
  templateUrl: './test-summary-pdf.component.html',
  styleUrls: ['./test-summary-pdf.component.css']
})

export class TestSummaryPdfComponent implements AfterViewInit,OnInit {
  constructor(private authService: AuthService,private adminService:AdminService){

  }
  // icons
  pdf = faFilePdf;
  id: number = 0;
  userData!: CandidateModel;
  questionsAttempted: QuestionAttempted[] = [];
  sqlQuestions : QuestionAttempted[] = [];
  questionsId: number[] = [];
  clubQuestions: QuestionAnswers[] = [];
  testName : string = '';

  hasProfile : boolean = false;
  profileImage : string = '../../../../assets/images/defaultProfile.png'

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('candidateId'));

    // get the canidate profile image
    this.adminService.getCandidateProfileImage_base64(this.id).subscribe((res)=>{
      if (res.error) {
        this.hasProfile = false;
      }
      else{
        this.hasProfile = true;
        this.profileImage = `data:image/png;base64, ${res.message}`;
      }
    });

    // get the test name
    this.adminService.getCandidatesTestName(this.id).subscribe((res)=>{
      this.testName = res.message;    
    });

    // get the user by id
    this.authService.getUserById(this.id).subscribe((res) => {
      this.userData = res;
      console.log('userData',res);
      
      this.questionsAttempted = res.questionAttempted;

      this.questionsAttempted = this.questionsAttempted.filter((element)=>{
        if (element.sqlQuery == null) {
          return element;
        }
        this.sqlQuestions.push(element);
        return;
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setTheQuestions();
    }, 200);
  }

  // Icons
  phone = faPhone;
  school = faSchool;
  email = faEnvelope;
  resume = faFilePdf;

  setTheQuestions(){
    // document.getElementById();
  }

  // export pdf
  exportPDF(){
    const element = document.getElementById('pdfHTML') as HTMLElement;
    html2canvas(element, {scrollY: -window.scrollY}).then((canvas)=>{
      const imageData = canvas.toDataURL('image/png');

      // a4 page width and height
      const pageWidth = 210;
      const pageHeight = 297;

      // instance of pdf object
      const pdf = new jspdf('p','mm','a4');
      // add the canvas imageData to pdf
      pdf.addImage(imageData,'PNG',0,0,pageWidth,pageHeight);

      pdf.save(`${this.userData.firstName}${this.userData.lastName}-${this.testName}_TestReport`);
    });
  }
}
