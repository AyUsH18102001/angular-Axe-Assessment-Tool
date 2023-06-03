import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PageBarComponent implements OnInit,AfterViewInit {
  constructor(){

  }
  ngAfterViewInit(): void {
    // set the current page
    const pageSelected  = JSON.parse(sessionStorage.getItem(this.pageKey)!);
    document.getElementById(`page-${pageSelected}`)?.classList.add('active');
  }

  pagesCollection : number[][] = [];
  pages : number[] = [];
  batchPage :number = 5;

  currentPageBatch :number = 0;

  @Input()
  pageCount! : number;
  @Input()
  pageKey : string = '';
  @Output()
  pageChange  = new EventEmitter();



  ngOnInit(): void {
    // get the page count
    let size : number = this.pageCount;
      if(size < this.batchPage){
        this.pages = new Array(size);
      }
      const batchCount = size/this.batchPage;
      for (let index = 0; index < batchCount; index++) {
        if (this.batchPage > size) {
          this.pagesCollection[index] = new Array(size);
        }
        else{
          this.pagesCollection[index] = new Array(this.batchPage);
          size = size - this.batchPage;
        }
      }
      this.pages = this.pagesCollection[this.currentPageBatch];
  }

  onPageChange(index:number){
    const page = (this.batchPage*this.currentPageBatch) + index;

    // remove the previous page highlight
    const previousPage = this.currentPageBatch > 0 ? 
                        (JSON.parse(sessionStorage.getItem(this.pageKey)!) - (this.currentPageBatch*this.batchPage)) :
                        (sessionStorage.getItem(this.pageKey));
    document.getElementById(`page-${previousPage}`)?.classList.remove('active');

    // save the page to the sesison storage
    sessionStorage.setItem(this.pageKey,page.toString());

    // highlight the current page
    document.getElementById(`page-${index}`)?.classList.add('active');

    // return event
    return this.pageChange.emit();
  }

  loadPreviousBatch(){
    // remove the highlight
    const previousPage = this.currentPageBatch > 0 ? 
                        (JSON.parse(sessionStorage.getItem(this.pageKey)!) - (this.currentPageBatch*this.batchPage)) :
                        (sessionStorage.getItem(this.pageKey));
    document.getElementById(`page-${previousPage}`)?.classList.remove('active');

    if (this.currentPageBatch != 0) {
      const pageLinks = document.getElementsByClassName('page');

      this.currentPageBatch = this.currentPageBatch - 1;
      this.pages = this.pagesCollection[this.currentPageBatch];

      for (let index = 0; index < this.pages.length; index++) {
        let pageNumber = (this.batchPage*this.currentPageBatch+1) + index;
        pageLinks[index].textContent = pageNumber.toString();
      }
    }
  }

  loadNextBatch(){
    // remove the highlight
    const previousPage = this.currentPageBatch > 0 ? 
                        (JSON.parse(sessionStorage.getItem(this.pageKey)!) - (this.currentPageBatch*this.batchPage)) :
                        (sessionStorage.getItem(this.pageKey));
    document.getElementById(`page-${previousPage}`)?.classList.remove('active');

    if (this.currentPageBatch < this.pagesCollection.length-1) {
      const pageLinks = document.getElementsByClassName('page');

      this.currentPageBatch = this.currentPageBatch + 1;
      this.pages = this.pagesCollection[this.currentPageBatch];

      for (let index = 0; index < this.pages.length; index++) {
        let pageNumber = (this.batchPage*this.currentPageBatch+1) + index;
        pageLinks[index].textContent = pageNumber.toString();
      }
    }
  }



}
