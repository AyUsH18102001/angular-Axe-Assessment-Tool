import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { LoginToken } from 'src/models/tokenLogin';

@Component({
  selector: 'app-token-login',
  templateUrl: './token-login.component.html',
  styleUrls: ['./token-login.component.css']
})
export class TokenLoginComponent {

  constructor(private authService:AuthService,private router:Router){
  }

  // Icons
  tokenIcon = faKeyboard;

  tokenBorderColor : string = 'grey';
  tokenPass : boolean = false;

  user : LoginToken = {
    token : ''
  }

  tokenLogin(){
    this.authService.tokenLoginUser(this.user).subscribe((res:any)=>{
      if (res.token == null) {       
        this.snackBarContent = res.error;
        this.showSnackbar('red','whitesmoke');
        this.clearInputs();
      }
      else{
        // save the token in the session storage
        sessionStorage.setItem("token",res.token);
        // navigate to test disclaimer screen
        this.router.navigate(['/axe_assessment'], {replaceUrl: true});
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

  clearInputs(){
    this.user.token = '';
  }

  tokenInputHandler(){
    if(this.user.token.length == 13){
      this.tokenBorderColor = 'green';
      this.tokenPass = true;
    }
    else{
      this.tokenBorderColor = 'red'
      this.tokenPass = false;
    }

    if (this.user.token.length === 0) {
      this.tokenBorderColor = 'grey';
      this.tokenPass = false;
    }
  }

}
