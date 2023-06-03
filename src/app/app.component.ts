import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'axe-assessment-tool';

  constructor(private router : Router){

  }

  // showNavbar(){
  //   return (this.router.url != '/test' && this.router.url != '/sqlTest');
  // }
  
}
