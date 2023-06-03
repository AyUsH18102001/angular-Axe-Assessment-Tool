import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { CandidateModel } from 'src/models/adminCandidateModel';
import { AdminService } from '../../services/admin.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  constructor(private adminService:AdminService,private router:Router){
    
  }

  candidateCardBackground : number = 0;

  ngOnInit(): void {
    if (this.candidate == null) {
      return;
    }
    else{
      this.getCandidateDetails()
    }
  }

  // Icons
  phone = faPhone;
  school = faSchool;
  email = faEnvelope;
  resume = faFilePdf;
  right = faArrowRight;

  @Input()
  candidate! : CandidateModel;

  @Output()
  sendEmail = new EventEmitter();

  defaultUserProfile : string = '../../../../assets/images/defaultProfile.png';
  resumeURL : string = '';

  // get candidate detals
  getCandidateDetails(){
    // get the canidate profile image
    this.adminService.getUserProfileImage(this.candidate.userId).subscribe((res)=>{
      if (res.message == '') {
        this.defaultUserProfile = '../../../../assets/images/defaultProfile.png';
      }
      else{
        this.defaultUserProfile = res.message;
      }
    });
    // get the candidate resume
    this.adminService.getUserResume(this.candidate.userId).subscribe((res)=>{
      if (res.message == '') {
        this.resumeURL = '';
      }
      else{
        this.resumeURL = res.message;
      }
    });
    // set the candidate card background
    this.candidateCardBackground = this.candidate.selectionStatus;
  }

  goTestPerformance(userId:number){
    // set the userId
    sessionStorage.setItem('candidateId',userId.toString());
    this.router.navigate(['/admin/testPerformance']);
  } 

  sendEmailHandler(userId:number){
    return this.sendEmail.emit(userId);
  }
}
