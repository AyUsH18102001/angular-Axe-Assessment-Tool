import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test-navbar',
  templateUrl: './test-navbar.component.html',
  styleUrls: ['./test-navbar.component.css']
})
export class TestNavbarComponent implements OnDestroy {
  constructor(private testService:TestService){
    const check = sessionStorage.getItem("minutes") != null ? true : false;
    if (check) {
      const minute = sessionStorage.getItem("minutes");
      this.timer(Number(minute),60);
      return;
    }
    this.timer(45,0);
    sessionStorage.setItem('timePeriod','0');
  }
  ngOnDestroy(): void {
    clearInterval(this.timerCount);
  }

  timerCount : any;

  @Input()
  userEmail : string = '';
  @Input()
  testName : string = '';

  @Output()
  endTest  = new EventEmitter();

  submitTest : boolean = false;
  

  onEndTest(){
    return this.endTest.emit();
  }

  timer(min:number,sec:number){
    let dt = new Date(new Date().setTime((min*60*1000)+(sec*1000)));
    let ctime = dt.getTime();
    let seconds = Math.floor((ctime % (1000 * 60))/ 1000);
    let minutes = Math.floor((ctime % (1000 * 60 * 60))/( 1000 * 60));
    this.timerCount = setInterval(()=>{
        if(seconds == 0) {
            minutes--;
            seconds=59;
            // set the minutes inthe session storage
            sessionStorage.setItem('minutes',minutes.toString());
            // set the time period
            sessionStorage.setItem('timePeriod',(Number(sessionStorage.getItem('timePeriod')!)+1).toString());
        } else {
            seconds--;
        }
        if(minutes == 0 ){
          return;
          // submit answers and end test
        }
        let formatted_sec = seconds < 10 ? `0${seconds}`: `${seconds}`;
        let formatted_min = minutes < 10 ? `0${minutes}`: `${minutes}`;
        document.getElementById("timer")!.innerText = `${formatted_min} : ${formatted_sec}`;
    }, 1000);
  }
}
