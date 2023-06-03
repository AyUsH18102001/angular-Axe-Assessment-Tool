import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { TestDisclaimerComponent } from './components/test-disclaimer/test-disclaimer.component';
import { TestComponent } from './components/test/test.component';
import { TestRulesListComponent } from './components/test-rules-list/test-rules-list.component';
import { OptionComponent } from './components/option/option.component';
import { OptionsComponent } from './components/options/options.component';
import { SharedModule } from '../shared/shared.module';
import { TestNavbarComponent } from './components/test-navbar/test-navbar.component';
import { FormsModule } from '@angular/forms';
import { QuestionComponent } from './components/question/question.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { TerminatedComponent } from './components/terminated/terminated.component';



@NgModule({
  declarations: [
    ProtectedComponent,
    TestDisclaimerComponent,
    TestComponent,
    TestRulesListComponent,
    QuestionComponent,
    OptionComponent,
    OptionsComponent,
    TestNavbarComponent,
    ThankyouComponent,
    TerminatedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class ProtectedModule { }
