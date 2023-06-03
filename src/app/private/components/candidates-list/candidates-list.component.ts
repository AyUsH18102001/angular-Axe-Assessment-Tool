import { Component, OnInit } from '@angular/core';
import { faAdd,faSearch } from '@fortawesome/free-solid-svg-icons';
import { CandidateModel } from 'src/models/adminCandidateModel';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.css']
})
export class CandidatesListComponent implements OnInit {

  private candidateTiles!: HTMLCollectionOf<Element>;
  userPageCount : number = 0;


  constructor(private adminService:AdminService){
    const page = sessionStorage.getItem('cPage');
    if (page == null) {
      sessionStorage.setItem('cPage','1');
    }
    // get the user page count
    this.adminService.getUserPageCount().subscribe((res)=>{
      this.userPageCount = res;
    });
  }

  ngOnInit(): void {
    //get the candidates
    this.adminService.getAllCandidates(1).subscribe((res : CandidateModel[])=>{
      this.candidates = res;
    });

    this.candidateTiles = document.getElementsByTagName('app-candidate');    
  }

  // Icons
  addIcon = faAdd;
  searchIcon = faSearch;

  candidates : CandidateModel[]= [];
  searchCandidate :string = '';
  noSuchCandidateFound :  boolean = false;

  addCandidate(){

  }

  onSearchChange(){
    const questionFound = [];
    for (let index = 0; index < this.candidateTiles.length; index++) {
      const content = this.candidateTiles[index].children[0].children[0].children[1].children[0].textContent!;
      if (!content.toLocaleLowerCase().includes(this.searchCandidate.toLowerCase())) {
        this.candidateTiles[index].setAttribute('class','hide');
      }
      else{
        questionFound.push(content);
        this.candidateTiles[index].removeAttribute('class'); 
      }
    }
    if (questionFound.length == 0 && this.searchCandidate.length != 0) {
      this.noSuchCandidateFound = true;
    }
    else{
      this.noSuchCandidateFound = false;
    }
  }

  getBatchOfCandidate(){

  }

  sendEmail(userId:number){
    this.snackBarContent = "Sending email...this might take a while";
    this.showSnackbar('green','whitesmoke',1200);
    // get the testName
    this.adminService.getCandidatesTestName(userId).subscribe((res)=>{
      const testName = res.message;
      console.log(res);
      if (res.error) {
        this.snackBarContent = "Please assign a test to the candidate";
        this.showSnackbar('red','whitesmoke');
        return;
      }
      this.adminService.sendTokenEmail(userId,testName).subscribe((res)=>{
        if (res != 'success') {
          this.snackBarContent = "Email sent successfully";
          this.showSnackbar('green','whitesmoke');
          return;
        }
      });
    });
  }

  snackBarContent : string = '';
  showSnackbar(backgroundColor:string, fontColor:string,duration=3000){
    const x = document.getElementById("snackbar")!;
    x.className = "show";
    x.style.background = backgroundColor;
    x.style.color = fontColor;
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, duration);
  }

}
