import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPerformanceComponent } from './test-performance.component';

describe('TestPerformanceComponent', () => {
  let component: TestPerformanceComponent;
  let fixture: ComponentFixture<TestPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
