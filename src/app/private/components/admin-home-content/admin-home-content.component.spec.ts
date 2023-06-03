import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHomeContentComponent } from './admin-home-content.component';

describe('AdminHomeContentComponent', () => {
  let component: AdminHomeContentComponent;
  let fixture: ComponentFixture<AdminHomeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHomeContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
