import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-view-tests',
  templateUrl: './view-tests.component.html',
  styleUrls: ['./view-tests.component.css']
})
export class ViewTestsComponent implements OnInit {
  constructor(private adminService: AdminService) {

  }

  date : Date = new Date();

  tests: {
    testId: 0,
    testName: '',
    testCreator: ''|0,
    mcq_Count: 0,
    sql_Count: 0,
    testCreatedDate : any,
    createdDate: string
  }[] = []

  ngOnInit(): void {
    // get all the tests
    this.getTests();
  }

  getTests(){
    this.adminService.getAllTests().subscribe((res) => {
      this.tests = res;        
      this.tests.forEach((element:any)=>{
        // get the test creator name
        this.adminService.getTestCreatorName(element.testCreator).subscribe((res: any) => {
          element.testCreator = res.message;
          element.createdDate = element.testCreatedDate.split('T')[0];
        });
      });
    });
  }

  showModal(testId:number) {
    sessionStorage.setItem("testId",testId.toString());
    document.getElementById('myModal')!.style.display = 'block';
  }

  removeModal() {
    document.getElementById('myModal')!.style.display = 'none';
  }

  deleteQuestion(){
    const testId = Number(sessionStorage.getItem("testId"));
    const deleteId = Number(sessionStorage.getItem("candidateId"));
    // delete test
    this.adminService.deleteTest(testId,deleteId).subscribe((res:any)=>{
      if (res.message == "success") {
        // get the tests
        this.getTests();
        // close modal
        this.removeModal();
        // show snackbar
        this.snackBarContent = "Test Deleted Successfully";
        this.showSnackbar('green','whitesmoke');
      }
      else{
        this.snackBarContent = "Error occured while deleting";
        this.showSnackbar('red','whitesmoke');
      }
    });
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
