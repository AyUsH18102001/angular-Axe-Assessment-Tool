import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSchemasComponent } from './table-schemas.component';

describe('TableSchemasComponent', () => {
  let component: TableSchemasComponent;
  let fixture: ComponentFixture<TableSchemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSchemasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSchemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
