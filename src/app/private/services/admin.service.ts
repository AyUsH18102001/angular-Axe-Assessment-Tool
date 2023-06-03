import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { AdminAllQuestion } from 'src/models/adminAllQuestion';
import { BehaviorSubject } from 'rxjs';
import { CandidateModel } from 'src/models/adminCandidateModel';
import { Option } from 'src/models/option';
import { AdminAddSqlQuestion } from 'src/models/adminAdSqlQuestion';
import { TestType } from 'src/models/testType';
import { Question } from 'src/models/question';
import { TestPaper } from 'src/models/testPaper';
import { TestRules } from 'src/models/testRules';
import { Test } from 'src/models/test';
import { SqlQuery } from 'src/models/sqlQuery';
import { SQL_Question } from 'src/models/sqlQuestion';
import { TableSchemas } from 'src/models/tableSchemas';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private questionURL :string = "https://localhost:7143/api/Question";
  private adminURL : string = "https://localhost:7143/api/Admin";
  private userURL : string = "https://localhost:7143/api/User";
  private emailURL : string = "https://localhost:7143/api/Email";
  private sqlQuestionURL : string = "https://localhost:7143/api/SqlQuestion";

  private options = {
    headers : new HttpHeaders({
      "Content-type":"application/json"
    })
  }

  constructor(private http:HttpClient) { 

  }

  private questionId_Subject = new BehaviorSubject(0);

  private questionData : AdminAddQuestion = {
    questionContent:'',
    questionTypeId:0,
    testTypeId:0,
    options:[],
    questionImage:null
  }; 
  private questionIdData_Subject = new BehaviorSubject<AdminAddQuestion>(this.questionData);
  currentQuestionIdData : Observable<AdminAddQuestion> = this.questionIdData_Subject.asObservable();

  currentQuestionId : Observable<number> = this.questionId_Subject.asObservable();


  // test paper subjects
  private testPaperQuestionList_Subject =  new BehaviorSubject<TestPaper[]>([]);
  currentQuestions : Observable<TestPaper[]> = this.testPaperQuestionList_Subject.asObservable();

  getQuestionsFromTest():TestPaper[]{
    let questions : TestPaper[] = [];
    this.currentQuestions.subscribe((res)=>{
      questions = res;
    });
    return questions;
  }

  flushQuestionsFromTest(){
    this.testPaperQuestionList_Subject.next([]);
  }
  
  addQuestionToTest(data:TestPaper){
    let questions : TestPaper[] = this.getQuestionsFromTest();
    questions.push(data);
    this.testPaperQuestionList_Subject.next(questions);
  }

  addQuestionsToTest(data:TestPaper[]){
    this.testPaperQuestionList_Subject.next(data);
  }

  removeQuestionFromTest(id:number){
    let questions : TestPaper[] = this.getQuestionsFromTest();
    questions = questions.filter((element)=>{
      return element.id != id;
    });
    this.addQuestionsToTest(questions);
  }

  // get all the questions
  getAllQuestions(page:number):Observable<AdminAllQuestion[]>{
    const url = `${this.questionURL}/${page}`
    return this.http.get<AdminAllQuestion[]>(url);
  }

  // get all test rules
  getAllTestRules():Observable<TestRules[]>{
    const url = `${this.adminURL}/getAllTestRules`;
    return this.http.get<TestRules[]>(url);
  }

  // create test
  createTest(data :Test):Observable<any>{
    const url = `${this.adminURL}/createTest`;
    return this.http.post<any>(url,data,this.options);
  }

  // update test
  updateTest(data:Test,testId:number){
    const url = `${this.adminURL}/updateTest/${testId}`;
    return this.http.post(url,data,this.options);
  }

  // delete test
  deleteTest(testId:number,deleteId:number){
    const url =`${this.adminURL}/deleteTest/${deleteId}/${testId}`;
    return this.http.delete(url);
  }

  // get all tests
  getAllTests():Observable<any>{
    const url = `${this.adminURL}/getTestNames`;
    return this.http.get<any>(url);
  }

  //get test creator name
  getTestCreatorName(creatorId:number){
    const url = `${this.adminURL}/getTestCreatorName/${creatorId}`;
    return this.http.get(url);
  }

  //assign test
  assignCandidateTest(data:any){
    const url = `${this.adminURL}/assignTest`;
    return this.http.post(url,data,this.options);
  }

  // send email
  sendTokenEmail(userId:number,testName:string):Observable<any>{
    const url = `${this.emailURL}/${userId}/${testName}`;
    return this.http.get<any>(url);
  }

  // get all the candidates
  getAllCandidates(page:number):Observable<CandidateModel[]>{
    const url = `${this.userURL}/getUsers/${page}`
    return this.http.get<CandidateModel[]>(url);
  }

  // get the candidates / user page count
  getUserPageCount():Observable<number>{
    const url = `${this.userURL}/pageCount`;
    return this.http.get<number>(url);
  }

  // get the question page count
  getQuestionPageCount():Observable<number>{
    const url = `${this.questionURL}/pageCount`;
    return this.http.get<number>(url);
  }

  // get the sql question page count
  getSqlQuestionPageCount():Observable<any>{
    const url = `${this.questionURL}/getSqlQuestionPageCount`;
    return this.http.get(url);
  }

  // get all the sql questions on the page
  getSQLQuestions(currentPage:number):Observable<AdminAddSqlQuestion[]>{
    const url = `${this.questionURL}/getSqlQuestions/${currentPage}`;
    return this.http.get<AdminAddSqlQuestion[]>(url);
  }

  // update question Attempted
  updateQuestionAttempted(data:any):Observable<string>{
    const url = `${this.userURL}/questionAttempted`;
    return this.http.post<string>(url,data,this.options);
  }

  // get question by id
  getQuestionById(questionId:number):Observable<AdminAddQuestion>{
    const url = `${this.questionURL}/getQuestion/${questionId}`;
    return this.http.get<AdminAddQuestion>(url);
  }

  // get sql question pointer by id
  getSqlQuestionById(questionId:number):Observable<SQL_Question>{
    const url = `${this.questionURL}/getSqlQuestion/${questionId}`;
    return this.http.get<SQL_Question>(url);
  }

  // get the sql Question (for edit) by id
  getSqlQuestionById_EditSql(questionId:number):Observable<AdminAddSqlQuestion>{
    const url = `${this.sqlQuestionURL}/${questionId}`;
    return this.http.get<AdminAddSqlQuestion>(url);
  }

  // update the sql question
  updateSqlQuestion(questionId:number,updated:AdminAddSqlQuestion){
    const url = `${this.sqlQuestionURL}/updateSqlQuestion/${questionId}`;
    return this.http.post(url,updated,this.options);
  }

  // get test paper
  getTestPaper(testId:number):Observable<TestPaper[]>{
    const url = `${this.adminURL}/getTestPaper/${testId}`;
    return this.http.get<TestPaper[]>(url);
  }

  // get candidates test name
  getCandidatesTestName(userId:number):Observable<any>{
    const url = `${this.userURL}/getTestName/${userId}`;
    return this.http.get<any>(url);
  }

  // update user selection status
  updateSelectionStatus(userId:number,state:number):Observable<boolean>{
    const url = `${this.adminURL}/updateSelectionState/${userId}/${state}`;
    return this.http.put<boolean>(url,this.options);
  }

  // get options of questions
  getOptions(questionId:number):Observable<Option[]>{
    const url = `${this.questionURL}/getOptions/${questionId}`;
    return this.http.get<Option[]>(url);
  }

  // get all questionType
  getAllQuestionType():Observable<string[]>{
    const url = `${this.questionURL}/questionTypes`
    return this.http.get<string[]>(url);
  }

  // get the SQL test Tables Schemas
  getTableSchemas():Observable<TableSchemas[]>{
    const url = `${this.adminURL}/getTableSchemas`;
    return this.http.get<TableSchemas[]>(url);
  }

  // get test rules
  getTestRules(userId:number):Observable<TestRules[]>{
    const url = `${this.adminURL}/getTestRules/${userId}`;
    return this.http.get<TestRules[]>(url);
  }

  // get test rules for edit
  getTestRules_edit(testId:number):Observable<TestRules[]>{
    const url = `${this.adminURL}/getTestRules_edit/${testId}`;
    return this.http.get<TestRules[]>(url);
  }

  // add a question to questionBank
  addQuestion(data : AdminAddQuestion):Observable<any>{
    const url = `${this.questionURL}/addQuestion`;
    return this.http.post<any>(url,data,this.options);
  }

  // update question
  updateQuestion(id:number,questionData:AdminAddQuestion):Observable<string>{
    const url = `${this.questionURL}/updateQuestion/${id}`;
    return this.http.put<string>(url,questionData,this.options);
  }

  // get last question
  getLastQuestion():Observable<AdminAllQuestion>{
    const url = `${this.questionURL}/lastQuestion`;
    return this.http.get<AdminAllQuestion>(url);
  }

  // add questionImage
  addQustionImage(image:FormData):Observable<any>{
    const url = `${this.questionURL}/addQuestionImage`;
    const options = {
      headers : new HttpHeaders({
        "enctype":"multipart/form-data"
      })
    }
    return this.http.post(url,image);
  }

  // delete question
  deleteQuestion(questionId:number,adminId:number):Observable<any>{
    const url = `${this.questionURL}/deleteQuestion`;
    const data = {
      questionId : questionId,
      adminId : adminId,
      deleteDate : new Date() 
    }
    return this.http.patch<any>(url,data);
  }

  // delete sql question
  deleteSqlQuestion(questionId:number,adminId:number):Observable<any>{
    const url = `${this.questionURL}/deleteSqlQuestion`;
    const data = {
      questionId : questionId,
      adminId : adminId,
      deleteDate : new Date() 
    }
    return this.http.patch<any>(url,data);
  }
  // add sql question
  addSqlQuestion(data:AdminAddSqlQuestion):Observable<string>{
    return this.http.post<string>(this.sqlQuestionURL,data,this.options).pipe(catchError((error: HttpErrorResponse)=>{
      throw new Error('The SQL question already exists');
    }));
  }

  // get the test types
  getTestTypes():Observable<TestType[]>{
    const url = `${this.questionURL}/getTestTypes`;
    return this.http.get<TestType[]>(url);
  }

  // get the question type
  getQuestionType(id:number):Observable<any>{
    const url = `${this.questionURL}/getQuestionType/${id}`;
    return this.http.get<any>(url);
  }

  // get questions of test type
  getQuestionOfTestType(typeId : number):Observable<AdminAddQuestion[]>{
    const url = `${this.questionURL}/getTestType_questions/${typeId}`;
    return this.http.get<AdminAddQuestion[]>(url);
  }

  // admin add bulk questions
  addBulkQuestions(bulk : AdminAddQuestion[]){
    const url = `${this.questionURL}/addBulkQuestions`;
    return this.http.post(url,bulk,this.options);
  }

  // download format csv file
  downloadFormat(){
    const url = `${this.adminURL}/downloadFormat`;
    return this.http.get(url);
  }

  //get user resume
  getUserResume(userId:number):Observable<any>{
    const url = `${this.userURL}/userResume/${userId}`;
    return this.http.get<any>(url);
  }

  //get user profle image
  getUserProfileImage(userId:number):Observable<any>{
    const url = `${this.userURL}/userImage/${userId}`;
    return this.http.get<any>(url);
  }

  // get the cadidate Profile image in base64
  getCandidateProfileImage_base64(userId:number):Observable<any>{
    const url = `${this.adminURL}/getCandidateProfile/${userId}`;
    return this.http.get<any>(url);
  }
  // get Question image url
  getQuestionImage(questionId:number):Observable<any>{
    console.log('getQuestionImage');
    const url = `${this.questionURL}/getQuestionImage/${questionId}`;
    return this.http.get<any>(url);
  }

  // A Subject to get the questionID to edit
  addQuestionId(id:number){
    this.questionId_Subject.next(id);
  }
  getQuestionId():Observable<number>{
    return this.currentQuestionId;
  }
}
