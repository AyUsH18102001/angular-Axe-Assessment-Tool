import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo-title',
  templateUrl: './logo-title.component.html',
  styleUrls: ['./logo-title.component.css']
})
export class LogoTitleComponent {
  constructor(private router:Router) {
    
  }

  @Input()
  testName : string = ''

  goHome(){    
    if (this.router.url == '/test') {
      return;
    }
    this.router.navigate(['']);
  }

}
