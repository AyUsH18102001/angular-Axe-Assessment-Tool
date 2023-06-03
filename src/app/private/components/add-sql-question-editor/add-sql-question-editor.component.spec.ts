import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSqlQuestionEditorComponent } from './add-sql-question-editor.component';

describe('AddSqlQuestionEditorComponent', () => {
  let component: AddSqlQuestionEditorComponent;
  let fixture: ComponentFixture<AddSqlQuestionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSqlQuestionEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSqlQuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
