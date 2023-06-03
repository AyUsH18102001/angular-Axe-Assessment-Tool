import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faNoteSticky, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-nav-links',
  templateUrl: './admin-nav-links.component.html',
  styleUrls: ['./admin-nav-links.component.css']
})
export class AdminNavLinksComponent implements AfterViewInit{
  constructor(private router:Router){
  }
  
  ngAfterViewInit(): void {
    this.setNavigationStyle();
  }

  navLinksLogo : IconDefinition[] = [
    faNoteSticky,
    faBook,
    faGraduationCap,
    faCode,
    faUserGroup
  ]

  navigatingLinks : string[] = [
    'Create New Test',
    'View All Tests',
    'Aptitude Questions',
    'SQL Questions',
    'Candidates',
  ];
  linksAddress : string[] = ['/admin','/admin/viewTests','/admin/questionBank','/admin/sqlQuestionBank','/admin/candidateList'];

  navigateLink(linkIndex:number){
    this.addDecoration(linkIndex);
    this.router.navigate([this.linksAddress[linkIndex]]);
  }

  // set the navigate Link style on it after page reload
  setNavigationStyle(){
    // read the nav index
    const index = sessionStorage.getItem('navigationIndex');
    this.addDecoration(Number(index));
  }

  // add the active class
  addDecoration(linkIndex:number){
    for (let index = 0; index < this.navigatingLinks.length; index++) {
      const link = document.getElementById(`link-${index}`);
      if (index != linkIndex) {
        link?.classList.remove('active');
      }
      else{
        sessionStorage.setItem('navigationIndex',linkIndex.toString());
        link?.classList.add('active');
      }
    }
  }
}
