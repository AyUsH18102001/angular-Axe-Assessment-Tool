import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { Login } from '../../../../models/login';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Icons
  emailIcon = faEnvelope;
  passwordIcon = faKey;
  passwordShowState = faEyeSlash;
  clear = faClose;

  passwordBorderColor: string = 'grey'
  emailBorderColor: string = 'grey'

  passwordPass: boolean = false;
  emailPass: boolean = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  user: Login = {
    email: "",
    password: ""
  }


  login() {
    if (this.user.email === '' && this.user.password === '') {
      this.snackBarContent = "Please enter email and password";
      this.showSnackbar('red', 'whitesmoke');
      return;
    }
    this.authService.loginUser(this.user).subscribe((res: any) => {
      if (res.token == null) {
        this.snackBarContent = res.error;
        this.showSnackbar('red', 'whitesmoke');
        this.clearInputs();
        return;
      }
      else {
        // store the tokenin the session storage
        sessionStorage.setItem('token', res.token);
        this.adminHome();
      }
    }, (error) => {
      this.snackBarContent = error;
      this.showSnackbar('red', 'whitesmoke');
      this.clearInputs();
    });
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

  clearEmail(){
    this.user.email = '';
    this.emailBorderColor = 'grey';
    this.emailPass = false;
  }

  giveTest() {
    this.router.navigate(['disclaimer'], { replaceUrl: true });
  }

  adminHome() {
    this.router.navigate(['admin/']);
  }

  snackBarContent: string = ''
  showSnackbar(backgroundColor: string, fontColor: string) {
    const x = document.getElementById("snackbar")!;
    x.className = "show";
    x.style.background = backgroundColor;
    x.style.color = fontColor;
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  clearInputs() {
    this.passwordBorderColor = 'grey';
    this.emailBorderColor = 'grey';
    this.emailPass = false;
    this.passwordPass = false;
    this.user.email = '';
    this.user.password = '';
  }

  goTokenLogin() {
    this.router.navigate(['tokenLogin']);
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  goToForgotPassword() {
    this.router.navigate(['forgotPassword']);
  }

  emailInputHandler() {
    const mailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.user.email.match(mailCheck)) {
      this.emailBorderColor = 'green'
      this.emailPass = true;
    }
    else {
      this.emailBorderColor = 'red'
      this.emailPass = false;
    }

    if (this.user.email.length === 0) {
      this.emailBorderColor = 'grey';
      this.emailPass = false;
    }
  }

  passwordInputHandler() {
    if (this.user.password.length > 8) {
      this.passwordBorderColor = 'green';
      this.passwordPass = true;
    }
    else {
      this.passwordBorderColor = 'red'
      this.passwordPass = false;
    }

    if (this.user.password.length === 0) {
      this.passwordBorderColor = 'grey';
      this.passwordPass = false;
    }
  }
}
