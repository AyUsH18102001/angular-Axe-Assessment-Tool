import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestQuestionsComponent } from './edit-test-questions.component';

describe('EditTestQuestionsComponent', () => {
  let component: EditTestQuestionsComponent;
  let fixture: ComponentFixture<EditTestQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTestQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
