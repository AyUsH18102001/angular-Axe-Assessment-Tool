import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TestType } from 'src/models/testType';
import { AdminService } from '../../services/admin.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Question } from 'src/models/question';
import { TestTypeAccordion } from 'src/models/testTypeAccordion';
import { TestPaper } from 'src/models/testPaper';

@Component({
  selector: 'app-test-type-accordian',
  templateUrl: './test-type-accordian.component.html',
  styleUrls: ['./test-type-accordian.component.css']
})
export class TestTypeAccordianComponent implements OnInit {
  constructor(private adminService: AdminService) {

  }

  @Output()
  sendToPaper = new EventEmitter();

  @Output()
  togglePanel = new EventEmitter();

  testTypeQuestions: TestTypeAccordion[] = [];
  ngOnInit(): void {
    // get the test types
    this.adminService.getTestTypes().subscribe((res) => {
      // get the test type questions
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        this.adminService.getQuestionOfTestType(element.testTypeId).subscribe((res) => {
          const type: TestTypeAccordion = {
            testypeId: element.testTypeId,
            test: element.test,
            short_name:element.short_name,
            questions: res
          };
          this.testTypeQuestions.push(type);
        });
      }
    });
  }

  getQuestionTypes() {
    // update the questionType according to questionTypeId
    this.testTypeQuestions.forEach((element) => {
      element.questions!.forEach((element) => {
        const id = element.questionTypeId;
        if (element.isSQL) {
          element.questionTypeId = "SQL";
        }
        else{
          this.adminService.getQuestionType(Number(id)).subscribe((res: any) => {
            element.questionTypeId = res.message;
          });
        }
      });
    });
  }

  togglePanelHandler(index: number) {
    var acc = document.getElementsByClassName("accordion")[index];
    acc.classList.toggle("active");
    const panel: any = acc.nextElementSibling!;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = 300 + panel.scrollHeight + "px";
    }
    return this.togglePanel.emit();
  }

  removeQuestionPanel(testId:number,index:number){
    const element =  document.getElementById(`question-${testId}-${index}`);
    if (element?.classList.contains('question')) {
      element?.classList.replace('question','added');
    }
  }

  sendTestData(){
    return this.sendToPaper.emit();
  }

  addToTest(data:TestPaper){
    // add data to service
    this.adminService.addQuestionToTest(data);
    document.getElementById('dummyAdd')?.click();
    return ;
  }






}
