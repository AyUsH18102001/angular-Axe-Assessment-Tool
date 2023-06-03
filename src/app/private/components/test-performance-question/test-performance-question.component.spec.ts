import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPerformanceQuestionComponent } from './test-performance-question.component';

describe('TestPerformanceQuestionComponent', () => {
  let component: TestPerformanceQuestionComponent;
  let fixture: ComponentFixture<TestPerformanceQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPerformanceQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPerformanceQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
