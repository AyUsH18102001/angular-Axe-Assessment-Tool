import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestPaperComponent } from './edit-test-paper.component';

describe('EditTestPaperComponent', () => {
  let component: EditTestPaperComponent;
  let fixture: ComponentFixture<EditTestPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTestPaperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTestPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
