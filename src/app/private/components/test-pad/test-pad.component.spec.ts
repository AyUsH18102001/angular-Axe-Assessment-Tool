import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPadComponent } from './test-pad.component';

describe('TestPadComponent', () => {
  let component: TestPadComponent;
  let fixture: ComponentFixture<TestPadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
