import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTypeAccordianComponent } from './test-type-accordian.component';

describe('TestTypeAccordianComponent', () => {
  let component: TestTypeAccordianComponent;
  let fixture: ComponentFixture<TestTypeAccordianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTypeAccordianComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTypeAccordianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
