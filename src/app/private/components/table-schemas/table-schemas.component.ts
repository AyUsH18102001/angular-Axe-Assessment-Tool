import { Component, Input } from '@angular/core';
import { TableSchemas } from 'src/models/tableSchemas';

@Component({
  selector: 'app-table-schemas',
  templateUrl: './table-schemas.component.html',
  styleUrls: ['./table-schemas.component.css']
})
export class TableSchemasComponent {
  constructor(){

  }

  @Input()
  tableSchemas : TableSchemas[] = [];
}
