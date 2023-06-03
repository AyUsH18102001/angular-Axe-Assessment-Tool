import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPerformanceSqlQuestionComponent } from './test-performance-sql-question.component';

describe('TestPerformanceSqlQuestionComponent', () => {
  let component: TestPerformanceSqlQuestionComponent;
  let fixture: ComponentFixture<TestPerformanceSqlQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPerformanceSqlQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPerformanceSqlQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
