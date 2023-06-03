import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { AdminService } from '../../services/admin.service';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { TestPaper } from 'src/models/testPaper';
import { AdminUiServiceService } from '../../services/admin-ui-service.service';

@Component({
  selector: 'app-test-type-questions-panel',
  templateUrl: './test-type-questions-panel.component.html',
  styleUrls: ['./test-type-questions-panel.component.css']
})
export class TestTypeQuestionsPanelComponent implements OnInit {

  @Input()
  questions: AdminAddQuestion[] = [];
  @Input()
  testypeId: number = 0;

  @Output()
  addToTest = new EventEmitter();

  // Icons
  add = faAdd;

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.questions.length != 0) {
        this.getQuestionTypes();
      }
    }, 250);    
  }

  getQuestionTypes() {
    // update the questionType according to questionTypeId
    this.questions.forEach((element, index) => {
      const id = element.questionTypeId;
      this.adminService.getQuestionType(Number(id)).subscribe((res: any) => {
        if (element.isSQL) {
          element.questionTypeId = "SQL";
        }
        else {
          this.adminService.getQuestionType(Number(id)).subscribe((res: any) => {
            element.questionTypeId = res.message;
          });
        }
      });
    });

    // update the testType with short_name
    this.adminService.getTestTypes().subscribe((res) => {
      this.questions.forEach((element) => {
        res.forEach((type) => {
          if (type.testTypeId == element.testTypeId) {
            element.short_name = type.short_name;
          }
        });
      });      
    });
  }

  addToTestHandler(questionId: number | undefined, questionContent: string, questionType: string | number, short_name: string|undefined) {
    const element = document.getElementById(`question-${this.testypeId}-${questionId}`);
    if (element?.classList.contains('added')) {
      return;
    }
    element?.classList.replace('question', 'added');
    const data: TestPaper = {
      id: Number(questionId),
      content: questionContent,
      type: questionType.toString(),
      testId: this.testypeId,
      short_name: short_name!,
    }
    return this.addToTest.emit(data);
  }

  removeQuestion(testId: number, index: number) {
    const element = document.getElementById(`question-${testId}-${index}`);
    if (element?.classList.contains('added')) {
      element?.classList.replace('added', 'question');
    }
  }

}
