import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNavbarComponent } from './test-navbar.component';

describe('TestNavbarComponent', () => {
  let component: TestNavbarComponent;
  let fixture: ComponentFixture<TestNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
