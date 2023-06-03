import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlBankQuestionComponent } from './sql-bank-question.component';

describe('SqlBankQuestionComponent', () => {
  let component: SqlBankQuestionComponent;
  let fixture: ComponentFixture<SqlBankQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqlBankQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlBankQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
