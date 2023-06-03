import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent {
  constructor(){

  }

  activeOption : boolean = false;

  @Input()
  questionId : any = '';
  @Input()
  questionType : string = '';
  @Input()
  optionId : any = '';

  @Input() optionNumber : string = '';
  @Input() option : string = '';

  multipleSelectOptions :number[] = [];

  optionSelect(){    
    if (this.questionType == 'MCQ' || this.questionType == "True/False") {
      const options = document.getElementsByClassName(`question-${this.questionId}`);

      const selectOption = document.getElementsByClassName(`question-${this.questionId}-${this.optionId}`);
      if (selectOption[0].classList.contains("active")) {
        selectOption[0].classList.remove('active');
        selectOption[0].classList.add('option');
      }
      else{
        selectOption[0].classList.remove('option');
        selectOption[0].classList.add('active');
      }
      
      for (let i = 0; i < options.length; i++) {
        if (options[i].classList.contains("active") && i != this.optionId) {          
          options[i].classList.remove("active");
          options[i].classList.add('option');
        }
      }
    }

    else if (this.questionType == 'Multiple Select') {
      const options = document.getElementsByClassName(`question-${this.questionId}`);
      for (let i = 0; i < options.length; i++) {
        if (options[i].classList.contains("active") && i == this.optionId) {
          options[i].classList.remove('active');
          options[i].classList.add('option');
          
          this.multipleSelectOptions = [];
        }
        else if(!options[i].classList.contains("active") && i == this.optionId) {
          options[i].classList.remove('option');
          options[i].classList.add('active');
          
          this.multipleSelectOptions = [];
        }
      }
    }

  }
}
