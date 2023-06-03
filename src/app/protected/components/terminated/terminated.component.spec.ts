import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatedComponent } from './terminated.component';

describe('TerminatedComponent', () => {
  let component: TerminatedComponent;
  let fixture: ComponentFixture<TerminatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
