import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminated',
  templateUrl: './terminated.component.html',
  styleUrls: ['./terminated.component.css']
})
export class TerminatedComponent implements OnInit {
  ngOnInit(): void {
    sessionStorage.clear();
  }

}
