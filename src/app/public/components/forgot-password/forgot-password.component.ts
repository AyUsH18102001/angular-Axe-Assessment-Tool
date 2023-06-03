import { Component } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ForgotPassword } from 'src/models/forgotPassword';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  constructor(private authService:AuthService){
  }
  // Icons
  emailIcon = faEnvelope;
  passwordIcon = faKey;
  close = faClose;
    
  confirmPassword : string = "";
  passwordMatch : boolean = false;

  passwordBorderColor: string = 'grey';
  emailBorderColor: string = 'grey';

  passwordPass: boolean = false;
  confirmPasswordPass : boolean = false;
  emailPass: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  passwordShowState = faEyeSlash;
  confirmPasswordShowState = faEyeSlash;
  clear = faClose;

  user : ForgotPassword = {
    email : "",
    password : ""
  }

  clearEmail(){
    this.user.email = '';
    this.emailBorderColor = 'grey';
    this.emailPass = false;
  }

  resetPassword(){
    // check if the password match
    this.user.password == this.confirmPassword ? this.passwordMatch = true : this.passwordMatch = false;

    if(!this.passwordMatch){
      alert("Password should match");
    }
    this.authService.resetUserPassword(this.user).subscribe((res)=>{
      console.log(res);
    })
  }

  togglePasswordShow(){
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordShowState = faEye;
    }
    else{
      this.passwordShowState = faEyeSlash;
    }
  }

  toggleConfirmPasswordShow(){
    this.showConfirmPassword = !this.showConfirmPassword;
    if (this.showConfirmPassword) {
      this.confirmPasswordShowState = faEye;
    }
    else{
      this.confirmPasswordShowState = faEyeSlash;
    }
  }
}
