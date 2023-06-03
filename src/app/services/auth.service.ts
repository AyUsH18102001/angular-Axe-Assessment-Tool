import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Login } from 'src/models/login';
import { catchError, Observable, throwError } from 'rxjs';
import { Register } from 'src/models/register';
import { ForgotPassword } from 'src/models/forgotPassword';
import { LoginToken } from 'src/models/tokenLogin';
import { UserData } from 'src/models/UserData';
import { CandidateModel } from 'src/models/adminCandidateModel';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL :string = "https://localhost:7143/api/User";
  private options = {
    headers : new HttpHeaders({
      "Content-type":"application/json"
    })
  };

  constructor(private http:HttpClient) { }

  errorHandler(error:HttpErrorResponse):string{
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return 'An error occurred:'+ error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      return `Backend returned code ${error.status}, ` + `body was: ${error.error}`;
    }
  }
  
  loginUser(user:Login):Observable<string>{
    const url = `${this.authURL}/login`;
    return this.http.post<string>(url,user,this.options).pipe(catchError((error: HttpErrorResponse)=>{
      throw new Error('Error Ocurred while performing the login request');
    }));
  }

  tokenLoginUser(user:LoginToken):Observable<any>{
    const url = `${this.authURL}/loginToken`;
    return this.http.post<any>(url,user,this.options);
  }

  registerUser(user:Register):Observable<any>{
    return this.http.post<string>(this.authURL,user,this.options).pipe(catchError((error: HttpErrorResponse)=>{
      throw new Error('Error Ocurred while registering,Please try later');
    }));
  }

  resetUserPassword(user:ForgotPassword):Observable<string>{
    const url = `${this.authURL}/forgotPassword`;
    return this.http.post<string>(url,user,this.options);
  }

  getUserById(userId:number):Observable<CandidateModel>{
    const url = `${this.authURL}/${userId}`;
    return this.http.get<CandidateModel>(url);
  }

  // get the user email and userId
  getUserEmailAndId() :Observable<UserData>{
    const url = `${this.authURL}/userEmailAndId`;
    return this.http.get<UserData>(url);
  }

  // add user resume
  addUserResume(resume:FormData):Observable<string>{
    const url = `${this.authURL}/uploadResume`;
    const options = {
      headers : new HttpHeaders({
        "enctype":"multipart/form-data"
      })
    };
    return this.http.post<string>(url,resume);
  }

  // add user profile
  addUserProfile(image:FormData):Observable<string>{
    const url = `${this.authURL}/uploadProfile`;
    const options = {
      headers : new HttpHeaders({
        "enctype":"multipart/form-data"
      })
    };
    return this.http.post<string>(url,image);
  }

  // returns role
  tokenRole(token:string):string{
    const claims:any = jwt_decode(token);
    const role = Object.values(claims)[2];
    return role as string;
  }

  // user authorization
  userAuthorization(token:string):boolean{
    const claims:any = jwt_decode(token); 
    const role = Object.values(claims)[2];
    if (role == "User") {
      return true;
    }
    return false;
  }
}
