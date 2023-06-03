import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSummaryPdfComponent } from './test-summary-pdf.component';

describe('TestSummaryPdfComponent', () => {
  let component: TestSummaryPdfComponent;
  let fixture: ComponentFixture<TestSummaryPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSummaryPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
