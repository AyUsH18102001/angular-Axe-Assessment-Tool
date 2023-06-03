import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './public/components/login/login.component';
import { ForgotPasswordComponent } from './public/components/forgot-password/forgot-password.component';
import { RegisterComponent } from './public/components/register/register.component';
import { TokenLoginComponent } from './public/components/token-login/token-login.component';
import { AuthServiceInterceptor } from './interceptors/auth-service.interceptor';
import { PrivateModule } from './private/private.module';
import { AdminHomeComponent } from './private/components/admin-home/admin-home.component';
import { PrivateComponent } from './private/private.component';
import { SharedModule } from './shared/shared.module';
import { QuestionFormComponent } from './private/components/question-form/question-form.component';
import { AddQuestionComponent } from './private/components/add-question/add-question.component';
import { EditQuestionComponent } from './private/components/edit-question/edit-question.component';
import { CandidatesListComponent } from './private/components/candidates-list/candidates-list.component';
import { TestPerformanceComponent } from './private/components/test-performance/test-performance.component';
import { ThankyouComponent } from './protected/components/thankyou/thankyou.component';
import { TerminatedComponent } from './protected/components/terminated/terminated.component';
import { AddSqlQuestionEditorComponent } from './private/components/add-sql-question-editor/add-sql-question-editor.component';
import { AddRulesComponent } from './private/components/add-rules/add-rules.component';
import { ViewTestsComponent } from './private/components/view-tests/view-tests.component';
import { EditTestComponent } from './private/components/edit-test/edit-test.component';
import { AdminGuardService } from './services/admin-guard.service';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProtectedModule } from './protected/protected.module';
import { PublicModule } from './public/public.module';
import { TestDisclaimerComponent } from './protected/components/test-disclaimer/test-disclaimer.component';
import { TestComponent } from './protected/components/test/test.component';
import { PublicComponent } from './public/public.component';
import { TestSummaryPdfComponent } from './private/components/test-summary-pdf/test-summary-pdf.component';
import { SqlQuestionBankComponent } from './private/components/sql-question-bank/sql-question-bank.component';

const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      { path: '', component: LoginComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'tokenLogin', component: TokenLoginComponent },
    ]
  },
  {
    path: 'axe_assessment', component: ProtectedComponent, children: [
      { path: '', component: TestDisclaimerComponent },
      { path: 'test', component: TestComponent },
      { path: 'thankyou', component: ThankyouComponent },
      { path: 'terminated', component: TerminatedComponent },
    ], canActivate: [AuthGuardService]
  },
  {
    path: 'admin', component: PrivateComponent, children: [
      { path: '', component: AdminHomeComponent },
      { path: 'questionBank', component: QuestionFormComponent },
      { path: 'addQuestion', component: AddQuestionComponent },
      { path: 'editQuestion', component: EditQuestionComponent },
      { path: 'candidateList', component: CandidatesListComponent },
      { path: 'testPerformance', component: TestPerformanceComponent },
      { path: 'sqlQuestionEditor', component: AddSqlQuestionEditorComponent },
      { path: 'addRules', component: AddRulesComponent },
      { path: 'viewTests', component: ViewTestsComponent },
      { path: "editTest", component: EditTestComponent },
      {path : "candidateReport",component:TestSummaryPdfComponent},
      { path: 'sqlQuestionBank', component: SqlQuestionBankComponent },
    ], canActivate: [AdminGuardService], data: { roles: "Admin" }
  }
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PrivateModule,
    ProtectedModule,
    PublicModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { enableTracing: true }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthServiceInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
