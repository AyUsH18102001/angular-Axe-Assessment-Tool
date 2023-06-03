import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDisclaimerComponent } from './test-disclaimer.component';

describe('TestDisclaimerComponent', () => {
  let component: TestDisclaimerComponent;
  let fixture: ComponentFixture<TestDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDisclaimerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
