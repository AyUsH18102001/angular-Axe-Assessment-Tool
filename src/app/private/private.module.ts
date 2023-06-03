import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionFormComponent } from './components/question-form/question-form.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../shared/shared.module';
import { AdminNavLinksComponent } from './components/admin-nav-links/admin-nav-links.component';
import { AdminHomeContentComponent } from './components/admin-home-content/admin-home-content.component';
import { QuestionBanksQuestionComponent } from './components/question-banks-question/question-banks-question.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { SafePipe } from './pipes/safePipe';
import { PageBarComponent } from './components/page-bar/page-bar.component';
import { CandidatesListComponent } from './components/candidates-list/candidates-list.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { TestPerformanceComponent } from './components/test-performance/test-performance.component';
import { TestPerformanceQuestionComponent } from './components/test-performance-question/test-performance-question.component';
import { AddSqlQuestionEditorComponent } from './components/add-sql-question-editor/add-sql-question-editor.component';
import { EditorModule,TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { TestTypeAccordianComponent } from './components/test-type-accordian/test-type-accordian.component';
import { TestTypeQuestionsPanelComponent } from './components/test-type-questions-panel/test-type-questions-panel.component';
import { TestPaperComponent } from './components/test-paper/test-paper.component';
import { AddRulesComponent } from './components/add-rules/add-rules.component';
import { TestPerformanceSqlQuestionComponent } from './components/test-performance-sql-question/test-performance-sql-question.component';
import { ViewTestsComponent } from './components/view-tests/view-tests.component';
import { TestPadComponent } from './components/test-pad/test-pad.component';
import { EditTestQuestionsComponent } from './components/edit-test-questions/edit-test-questions.component';
import { EditTestPaperComponent } from './components/edit-test-paper/edit-test-paper.component';
import { EditTestComponent } from './components/edit-test/edit-test.component';
import { TableSchemasComponent } from './components/table-schemas/table-schemas.component';
import { TestSummaryPdfComponent } from './components/test-summary-pdf/test-summary-pdf.component';
import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { SqlQuestionBankComponent } from './components/sql-question-bank/sql-question-bank.component';
import { SqlBankQuestionComponent } from './components/sql-bank-question/sql-bank-question.component';


@NgModule({
  declarations: [
    QuestionFormComponent,
    AdminHomeComponent,
    PrivateComponent,
    AdminNavLinksComponent,
    AdminHomeContentComponent,
    QuestionBanksQuestionComponent,
    AddQuestionComponent,
    EditQuestionComponent,
    PageBarComponent,
    SafePipe,
    CandidatesListComponent,
    CandidateComponent,
    TestPerformanceComponent,
    TestPerformanceQuestionComponent,
    AddSqlQuestionEditorComponent,
    TestTypeAccordianComponent,
    TestTypeQuestionsPanelComponent,
    TestPaperComponent,
    AddRulesComponent,
    TestPerformanceSqlQuestionComponent,
    ViewTestsComponent,
    TestPadComponent,
    EditTestQuestionsComponent,
    EditTestPaperComponent,
    EditTestComponent,
    TableSchemasComponent,
    TestSummaryPdfComponent,
    TestSummaryComponent,
    SqlQuestionBankComponent,
    SqlBankQuestionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EditorModule
  ],
  exports:[
    SafePipe
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
})
export class PrivateModule { }
