import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit{
  constructor(private authService:AuthService,private router:Router){

  }

  firstName : string = '';
  lastName : string = '';

  ngOnInit(): void {

     // get the userId and userEmail
    this.authService.getUserEmailAndId().subscribe((res)=>{
      this.firstName = res.firstName!;
      this.lastName = res.lastName!;
      
      // initialize the user data in the session storage
      sessionStorage.setItem('userEmail',res.email!);
      sessionStorage.setItem('userId',res.userId.toString());
      sessionStorage.setItem('firstname',res.firstName!);
      sessionStorage.setItem('lastname',res.lastName!);
    }); 
  }

  showHomeContent(){
    return this.router.url == '/admin'
  }

  not_showHomeContent(){
    return this.router.url != '/admin'
  }

}
