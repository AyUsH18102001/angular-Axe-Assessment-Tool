import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTypeQuestionsPanelComponent } from './test-type-questions-panel.component';

describe('TestTypeQuestionsPanelComponent', () => {
  let component: TestTypeQuestionsPanelComponent;
  let fixture: ComponentFixture<TestTypeQuestionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTypeQuestionsPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTypeQuestionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
