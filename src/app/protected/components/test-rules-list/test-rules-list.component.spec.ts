import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRulesListComponent } from './test-rules-list.component';

describe('TestRulesListComponent', () => {
  let component: TestRulesListComponent;
  let fixture: ComponentFixture<TestRulesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestRulesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestRulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
