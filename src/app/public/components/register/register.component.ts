import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Register } from 'src/models/register';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private authService:AuthService,private router:Router){

  }

  //Logo
  emailIcon = faEnvelope;
  passwordIcon = faKey;
  username = faUser;
  phoneIcon = faPhone;
  image = faImage;
  school = faSchool;
  resume = faFilePdf;

  confirmPassword:string = '';
  passwordMatch : boolean = false;

  firstNameBorderColor : string = 'grey';
  lastNameBorderColor : string = 'grey';
  phoneBorderColor : string = 'grey';
  passwordBorderColor :string = 'grey';
  confirmPasswordBorderColor :string = 'grey';
  emailBorderColor :string = 'grey';
  collegeBorderColor :string = 'grey';

  firstNamePass : boolean = false;
  lastNamePass : boolean = false;
  phonePass : boolean = false;
  passwordPass : boolean = false;
  emailPass : boolean = false;
  collegePass : boolean = false;
  confirmPasswordPass : boolean = false;

  user : Register = {
    firstName : "",
    lastName:"",
    email:"",
    college:"",
    phone:"",
    selectionStatus: 0,
    violation: 0,
    userResumeFileName:"",
    userProfileImage:"",
    isAdmin: false,
    userTest: {
        endTest: false,
        score: 0,
        attempted: 0
    }
  }

  imageFilePath : string = '';
  imageFormData : FormData = new FormData();
  imageFile! : File;
  imageURL : string = '';

  showImage : boolean = false;
  fileReader : FileReader = new FileReader();
  imageData : Uint8Array = new Uint8Array();
  imagePathBase64 : string | null= '';

  pdfFilePath : string = '';
  pdfFormData : FormData = new FormData();
  pdfFile! : File;
  pdfURL : string = '';

  showPdf : boolean = false;
  pdfReader : FileReader = new FileReader();
  pdfData : Uint8Array = new Uint8Array();
  pdfPathBase64 : string | null= '';

  registerButtonVisible : boolean = false; 

  register(){
    this.user.userProfileImage = this.imageFilePath;
    this.user.userResumeFileName = this.pdfFilePath;

    // if(this.user.password != this.confirmPassword){
    //   this.snackBarContent = "Password should match"
    //   this.showSnackbar('red','whitesnoke');
    //   return;
    // }
    
    let registerError = false;
    let message = '';
    if (this.imageFilePath != '' && this.pdfFilePath != '') {
      this.authService.registerUser(this.user).subscribe((res:any)=>{
        console.log(res);
        if (res.error) {
          registerError = true;
          message = res.message;
          return;
        }
        // add the user resume
        this.pdfFormData.append(this.pdfFile.name,this.pdfFile);
        this.authService.addUserResume(this.pdfFormData).subscribe((res)=>{
          console.log(res);
        });
        // add the user profile
        this.imageFormData.append(this.imageFile.name,this.imageFile);
        this.authService.addUserProfile(this.imageFormData).subscribe((res)=>{
          console.log(res);
        });
      },
      (error)=>{
        this.snackBarContent = error;
        this.showSnackbar('red','whitesnoke');
        return;
      },
      ()=>{
        if (registerError) {
          this.snackBarContent = message;
          this.showSnackbar('red','whitesnoke');
          return;
        }
        this.snackBarContent = "You have been registered successfully";
        this.showSnackbar('green','whitesnoke');
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3200);
        
      });
    }
    else{
      this.snackBarContent = "Upload all the files";
      this.showSnackbar('red','whitesnoke');
      return;
    }
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

  clickInputFile(fileType:string){
    if (fileType == 'userImage') {
      document.getElementById('userImage')?.click();
    } else {
      document.getElementById('userResume')?.click();
    }
  }

  getImageFile(event:Event,isImage:boolean){
    const element = event.currentTarget as HTMLInputElement;

    let fileList: FileList | null = element.files!;
    if (isImage) {
      if (fileList[0].type == 'image/png' || fileList[0].type == 'image/jpeg') {
        this.imageFile = fileList[0];
        this.imageFilePath = fileList[0].name;
        this.readmageData(this.imageFile);
      }
      else{
        this.imageFilePath = "Please select .png files or .jpeg files";
        this.showImage = false;  
      }
    }
    else{
      if (fileList[0].type == 'application/pdf') {
        this.pdfFile = fileList[0];
        this.pdfFilePath = fileList[0].name;
        this.readPDF(this.pdfFile);
      }
      else{
        this.pdfFilePath = "Please select .pdf files";
        this.showPdf = false;  
      }
    }
  }

  readmageData(file : File){
    // read image
    this.fileReader.readAsArrayBuffer(file);
    // read complete
    this.fileReader.onload = ()=>{
      const data : ArrayBuffer = this.fileReader.result as ArrayBuffer;
      this.imageData = new Uint8Array(data);
      var blob = new Blob([this.imageData], {'type': 'image/png'});
      var url = URL.createObjectURL(blob);
      this.imageURL = url;
      setTimeout(() => {
      }, 120);
      this.showImage = true;  
    }; 
  }

  readPDF(file:File){
    // read pdf
    this.pdfReader.readAsArrayBuffer(file);
    // read complete
    this.pdfReader.onload = ()=>{
      const data : ArrayBuffer = this.pdfReader.result as ArrayBuffer;
      this.pdfData = new Uint8Array(data);
      var blob = new Blob([this.pdfData], {'type': 'application/pdf'});
      var url = URL.createObjectURL(blob);
      this.pdfURL = url;
      setTimeout(() => {
      }, 120);
      this.showPdf = true;  
    }; 
  }

  fnameInputHandler(){
    if(this.user.firstName.length != 0){
      this.firstNameBorderColor = 'green'
      this.firstNamePass = true;
      this.registerButtonVisible = this.firstNamePass && this.lastNamePass && this.phonePass && this.emailPass  && this.collegePass; 
    }
    if(this.user.firstName.length == 0){
      this.firstNameBorderColor = 'grey'
      this.firstNamePass = false;
    }
  }

  lnameInputHandler(){
    if(this.user.lastName.length != 0){
      this.lastNameBorderColor = 'green';
      this.lastNamePass = true;
      this.registerButtonVisible = this.firstNamePass && this.lastNamePass && this.phonePass && this.emailPass  && this.collegePass; 

    }
    if(this.user.firstName.length == 0){
      this.lastNameBorderColor = 'grey';
      this.lastNamePass = false;
    }
  }

  phoneInputHandler(){
    if(this.user.phone.length == 10){
      this.phoneBorderColor = 'green';
      this.phonePass = true;
      this.registerButtonVisible = this.firstNamePass && this.lastNamePass && this.phonePass && this.emailPass  && this.collegePass; 

    }
    if(this.user.phone.length < 9 || this.user.phone.length > 10){
      this.phoneBorderColor = 'red';
      this.phonePass = false;
    }
    if(this.user.phone.length == 0){
      this.phoneBorderColor = 'grey';
      this.phonePass = false;
    }

  }

  emailInputHandler(){
    const mailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.user.email.match(mailCheck)) {
      this.emailBorderColor = 'green'
      this.emailPass = true;
      this.registerButtonVisible = this.firstNamePass && this.lastNamePass && this.phonePass && this.emailPass  && this.collegePass; 

    }
    else{
      this.emailBorderColor = 'red'
      this.emailPass = false;
    }

    if (this.user.email.length === 0) {
      this.emailBorderColor = 'grey';
      this.emailPass = false;
    }
  }

  collegeInputHandler(){
    if (this.user.college.length > 3) {
      this.collegeBorderColor = 'green';
      this.collegePass = true;
      this.registerButtonVisible = this.firstNamePass && this.lastNamePass  && this.phonePass
      && this.emailPass && this.collegePass;
    }
    else{
      this.collegeBorderColor = 'grey';
      this.collegePass = false;
    }
  }

  // passwordInputHandler(){
  //   if(this.user.password.length > 8){
  //     this.passwordBorderColor = 'green';
  //     this.passwordPass = true;
  //   }
  //   else{
  //     this.passwordBorderColor = 'red'
  //     this.passwordPass = false;
  //   }

  //   if (this.user.password.length === 0) {
  //     this.passwordBorderColor = 'grey';
  //     this.passwordPass = false;
  //   }
  // }

  // confirmPasswordInputHandler(){
  //   if(this.user.password == this.confirmPassword){
  //     this.confirmPasswordBorderColor = 'green';
  //     this.passwordMatch = true;
  //     this.confirmPasswordPass = true;
  //   }
  //   else{
  //     this.confirmPasswordBorderColor = 'red'
  //     this.confirmPasswordPass = false;
  //   }

  //   if (this.user.password.length === 0) {
  //     this.confirmPasswordBorderColor = 'grey';
  //     this.confirmPasswordPass = false;
  //   }
  // }
}
