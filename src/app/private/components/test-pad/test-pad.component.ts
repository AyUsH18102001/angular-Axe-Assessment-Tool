import {  Component, EventEmitter, Input, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { TestPaper } from 'src/models/testPaper';

@Component({
  selector: 'app-test-pad',
  templateUrl: './test-pad.component.html',
  styleUrls: ['./test-pad.component.css']
})
export class TestPadComponent {
  constructor(private adminService:AdminService,private router:Router){

  }

  // icons
  edit = faEdit;
  delete = faTrash;

  @Input() 
  test! : any;
  @Output()
  deleteTest = new EventEmitter();

  questions : TestPaper[] = []

  editTest(){  
    // get the test questions
    this.adminService.getTestPaper(this.test.testId).subscribe((res)=>{
      this.adminService.addQuestionsToTest(res);
    });

    // get the test rules
    this.adminService.getTestRules_edit(this.test.testId).subscribe((res)=>{
      sessionStorage.setItem('rules',JSON.stringify(res));
    });

    sessionStorage.setItem('editTest',this.test.testName);
    sessionStorage.setItem('testId',this.test.testId);
    setTimeout(() => {
      this.router.navigate(['/admin/editTest']);
    }, 500);
  }

  deleteTestHandler(testId:number){
    return this.deleteTest.emit(testId);
  }

}
