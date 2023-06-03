import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlQuestionBankComponent } from './sql-question-bank.component';

describe('SqlQuestionBankComponent', () => {
  let component: SqlQuestionBankComponent;
  let fixture: ComponentFixture<SqlQuestionBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqlQuestionBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
