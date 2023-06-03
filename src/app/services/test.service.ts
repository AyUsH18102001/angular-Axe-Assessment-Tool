import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminAddSqlQuestion } from 'src/models/adminAdSqlQuestion';
import { Question } from 'src/models/question';
import { QuestionAnswers } from 'src/models/questionAnswers';
import { RunQuery } from 'src/models/runQuery';
import { SqlResponse } from 'src/models/sqlResponse';
import { SubmitSqlQuery } from 'src/models/submitSqlQuery';
import { TestPaper } from 'src/models/testPaper';
import { UserData } from 'src/models/UserData';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http:HttpClient) { }

  private userURL :string = "https://localhost:7143/api/User";
  private questionURL : string = "https://localhost:7143/api/Question";
  private sqlQuestionsURL : string = "https://localhost:7143/api/SqlQuestion";

  private options = {
    headers : new HttpHeaders({
      "Content-type":"application/json"
    })
  }

  private submitTest_Subject =  new BehaviorSubject<boolean>(false);
  submitTestFlag : Observable<boolean> = this.submitTest_Subject.asObservable(); 

  toggleSubmitTestFlag(value:boolean){
    this.submitTest_Subject.next(value);
  }

  testData(userId:number): Observable<Question[]> {
    const url = `${this.userURL}/testData/${userId}`
    return this.http.get<Question[]>(url);
  }

  submitTest(data:any): Observable<string>{
    const url = `${this.userURL}/testSubmit`;
    return this.http.post<string>(url,data,this.options);
  }

  endTest(){
    const userId = sessionStorage.getItem('userId')!;
    const data : UserData = {
      userId : Number(userId),
    }
    const url = `${this.userURL}/updateEndTest`;
    return this.http.put(url,data,this.options);
  }

  // get test information
  getTestInformation(userId:number):Observable<any>{
    const url = `${this.userURL}/getTestInformation/${userId}`;
    return this.http.get<any>(url);
  }

  updateSqlScore(userId:number){
    const url = `${this.userURL}/updateSqlScore`;
    const data : UserData = {
      userId : userId,
    }
    return this.http.put(url,data,this.options);
  }

  submitSqlQuery(data:SubmitSqlQuery[]):Observable<any>{
    const url = `${this.userURL}/submitSqlQuery`;
    return this.http.post<any>(url,data,this.options);
  }

  getQuestionImage(id:number):Observable<any>{
    const url = `${this.questionURL}/getQuestionImage/${id}`
    return this.http.get(url);
  }

  // get the sql questions
  getSqlTestData(id:number):Observable<AdminAddSqlQuestion[]>{
    const url = `${this.userURL}/getSqlTestData/${id}`;
    return this.http.get<AdminAddSqlQuestion[]>(url);
  }

  // run sql query
  runSqlQuery(data : RunQuery):Observable<SqlResponse>{
    const url = `${this.userURL}/runSql`;
    return this.http.post<SqlResponse>(url,data,this.options);
  }

}
