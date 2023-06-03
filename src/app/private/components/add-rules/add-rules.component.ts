import { AfterViewInit, Component, OnInit } from '@angular/core';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { TestRules } from 'src/models/testRules';
import { AdminService } from '../../services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-rules',
  templateUrl: './add-rules.component.html',
  styleUrls: ['./add-rules.component.css'],
})
export class AddRulesComponent implements OnInit, AfterViewInit {

  constructor(private adminService: AdminService, private location: Location) {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setTheRules();
    }, 220);
  }

  rules: TestRules[] = [];

  setTheRules(){
    // if we have rules in session storage
    const editTestRules = sessionStorage.getItem('rules') != null ? true : false;
    const addTestRules = sessionStorage.getItem('testRules') != null ? true : false;
    if (editTestRules) {
      const rules: TestRules[] = JSON.parse(sessionStorage.getItem('rules')!);
      // enable all the rules mentioned in the rules var
      // get the toggles
      rules.forEach((element)=>{
        this.rules.forEach((rules)=>{
          if (rules.short_name == element.short_name) {
            rules.state= true;
          }
        });
      });
    }
    
    if (addTestRules) {
      this.rules = JSON.parse(sessionStorage.getItem('testRules')!);
    }
  }

  ngOnInit(): void {
    // get all the test rules
    this.adminService.getAllTestRules().subscribe((res) => {
      this.rules = res;
    });
  }

  //icons
  add = faAdd;
  delete = faDeleteLeft;

  save() {
    // save the test rules selected 
    sessionStorage.setItem('testRules', JSON.stringify(this.rules));
    // go back
    this.location.back();
  }
}
