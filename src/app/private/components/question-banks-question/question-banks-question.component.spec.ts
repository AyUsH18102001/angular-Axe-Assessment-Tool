import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBanksQuestionComponent } from './question-banks-question.component';

describe('QuestionBanksQuestionComponent', () => {
  let component: QuestionBanksQuestionComponent;
  let fixture: ComponentFixture<QuestionBanksQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionBanksQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionBanksQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
