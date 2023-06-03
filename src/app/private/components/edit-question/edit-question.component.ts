import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminAddOption } from 'src/models/adminAddOption';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { TestType } from 'src/models/testType';
import { AdminService } from '../../services/admin.service';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit, AfterViewInit, OnDestroy {

  id = JSON.parse(sessionStorage.getItem('questionId')!);

  // icons
  close = faClose;

  imageExists: boolean = false;

  imageFilePath: string = '';
  imageFormData: FormData = new FormData();
  imageFile!: File;
  imageURL: string = '';

  showImage: boolean = false;
  fileReader: FileReader = new FileReader();
  imageData: Uint8Array = new Uint8Array();
  imagePathBase64: string | null = '';

  constructor(private adminService: AdminService) {
    // get the question
    this.questionDatasubscription = this.adminService.getQuestionById(this.id).subscribe((res) => {
      this.editQuestion = res;
      // set the question data to the appropriare input fields
      this.questionTypeSelected();
      this.changeOptionsObjectToAnswer();

      // does the question has an image
      if (this.editQuestion.questionImage != null) {
        //set the imageame from db
        this.imageFilePath = this.editQuestion.questionImage;
        // get the questionImage url from server 
        const id = this.editQuestion.questionId!;
        this.adminService.getQuestionImage(id).subscribe((res) => {
          if (res.message != "") {
            this.imageURL = res.message;
          }
        })
        this.imageExists = true;
      } else {
        this.imageExists = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // get the question
    this.questionDatasubscription = this.adminService.getQuestionById(this.id).subscribe((res) => {
      this.editQuestion = res;
      console.log(res);
      
      if (this.editQuestion.questionImage != null) {
       this.showImage = true; 
      }
      // set the question data to the appropriare input fields
      this.setQuestionAnswer();
      this.getQuestionAnswer();
      // get all the questiontTypes
      this.adminService.getAllQuestionType().subscribe((res: any) => {
        this.questionTypes = res;
        // set the edit question short_name
        this.questionTypes.forEach((element) => {
          if (element.questionTypeId == this.editQuestion.questionTypeId) {
            this.editQuestion.short_name = element.short_name
          }
        });
      });

      // get all the test types
      this.adminService.getTestTypes().subscribe((res) => {
        this.testTypes = res;
      });
    });
  }

  ngOnDestroy(): void {
    this.questionDatasubscription.unsubscribe();
  }

  editQuestion: AdminAddQuestion = {
    questionId: 0,
    questionContent: '',
    questionTypeId: 0,
    options: [],
    testTypeId: 0,
    questionImage: null,
    short_name: ''
  }
  editQuestionOptions: string[] = [];

  questionDatasubscription: Subscription = new Subscription();
  showOptionInput: boolean = false;

  ngOnInit(): void {
  }

  options: number[] = [];
  questionTypes: {
    questionTypeId: 0,
    type: 0,
    short_name: '',
  }[] = [];
  testTypes: TestType[] = [];
  questionAnswer: number[] = [];

  @ViewChild('editForm') questionForm!: NgForm;

  questionTypeSelected() {
    if (Number(this.editQuestion.questionTypeId) == 1) {
      // this.uiAdminService.toggleInput(false);
      this.showOptionInput = false;
      this.options = Array(2);
      return;
    }
    if (Number(this.editQuestion.questionTypeId) > 1) {
      // this.uiAdminService.toggleInput(true);
      this.showOptionInput = true;
      this.options = Array(4);
      return;
    }
  }

  changeOptionsObjectToAnswer() {
    for (let index = 0; index < this.editQuestion.options.length; index++) {
      this.editQuestionOptions[index] = this.editQuestion.options[index].answer;
    }
  }


  setQuestionAnswer() {
    if (this.showOptionInput) {
      for (let index = 0; index < this.editQuestion.options.length; index++) {
        const optionBlob = document.getElementById(`select-${index}`)!;
        if (optionBlob == undefined) {
          break;
        }
        if (this.editQuestion.options[index].score != 0) {
          optionBlob.classList.add('selected');
          this.questionAnswer.push(index);
        }
      }
    }
    else {
      for (let index = 0; index < this.editQuestion.options.length; index++) {
        const option = this.editQuestion.options[index];
        if (option.answer == 'True' && option.score != 0) {
          const optionBlob = document.getElementById(`true`)!;
          optionBlob != undefined ? optionBlob.style.backgroundColor = 'rgb(184, 252, 116)' : '';
          break;
        }
        else {
          const optionBlob = document.getElementById(`false`)!;
          optionBlob != undefined ? optionBlob.style.backgroundColor = 'rgb(184, 252, 116)' : '';
          break;
        }
      }
    }
    console.log(this.questionAnswer);
    this.questionAnswer = [];
    console.log(this.questionAnswer);

  }

  getQuestionAnswer() {
    const optionBlob = document.getElementsByClassName('selectBlob');
    for (let index = 0; index < optionBlob.length; index++) {
      if (optionBlob[index].classList.contains('selected')) {
        this.questionAnswer.push(index);
      }
    }
  }

  addTrueOrFalse(selected: boolean) {
    const optiont = document.getElementById(`true`);
    const optionf = document.getElementById(`false`);
    if (selected) {
      const options: AdminAddOption[] = [
        {
          score: 10,
          answer: "True"
        },
        {
          score: 0,
          answer: "False"
        }
      ]
      this.editQuestion.options = [];
      this.editQuestion.options = options;
      if (!optiont?.classList.contains('selected')) {
        optiont?.classList.add('selected');
        optionf?.classList.remove('selected');
        optiont!.style.backgroundColor = 'rgb(184, 252, 116)';
        optionf!.style.backgroundColor = 'rgb(187, 186, 186)';
      }
      else {
        optiont!.style.backgroundColor = 'rgb(187, 186, 186)';
        optiont?.classList.remove('selected');
      }
    }
    else {
      const options: AdminAddOption[] = [
        {
          score: 0,
          answer: "True"
        },
        {
          score: 10,
          answer: "False"
        }
      ]
      this.editQuestion.options = [];
      this.editQuestion.options = options;
      if (!optionf?.classList.contains('selected')) {
        optionf?.classList.add('selected');
        optiont?.classList.remove('selected');
        optionf!.style.backgroundColor = 'rgb(184, 252, 116)';
        optiont!.style.backgroundColor = 'rgb(187, 186, 186)';
      }
      else {
        optionf!.style.backgroundColor = 'rgb(187, 186, 186)';
        optionf?.classList.remove('selected');
      }
    }
  }

  removeImage(){
    this.imageFile = null as unknown as File;
    this.showImage = false;
    this.imageFilePath = '';
  }

  selectOptionAsAnswer(index: number) {
    console.log(this.editQuestion.short_name);

    const option = document.getElementById(`select-${index}`);
    if (this.editQuestion.short_name == "ms" || this.editQuestion.questionTypeId == 4) {
      console.log('ms');

      if (!option?.classList.contains('selected')) {
        option?.classList.add('selected');
      }
      else {
        option?.classList.remove('selected');
        if (this.questionAnswer.includes(index)) {
          // remove the index
          this.questionAnswer = this.questionAnswer.filter((value: number) => {
            return value != index;
          });
        }
      }
    }

    else if (this.editQuestion.short_name == "mcq") {
      const optionBlob = document.getElementsByClassName('selectBlob');
      for (let i = 0; i < optionBlob.length; i++) {
        if (optionBlob[i].classList.contains('selected')) {
          optionBlob[i].classList.remove('selected');
        }
        if (i === index) {
          optionBlob[i].classList.add('selected');
          this.questionAnswer = [];
          this.questionAnswer.push(i)
        }
      }
    }
  }

  addScoreToSelectedAnswer() {
    const options: AdminAddOption[] = [];
    for (let index = 0; index < this.editQuestion.options.length; index++) {
      if (this.questionAnswer.includes(index)) {
        const option: AdminAddOption = {
          score: 10,
          answer: this.questionForm.value[`options-${index}`]
        }
        options.push(option)
      }
      else {
        const option: AdminAddOption = {
          score: 0,
          answer: this.questionForm.value[`options-${index}`]
        }
        options.push(option)
      }
    }
    this.editQuestion.options = [];
    this.editQuestion.options = options;
  }

  removeSelectedAnswer() {
    const options = document.getElementsByClassName('selectBlob');
    for (let index = 0; index < options.length; index++) {
      const element = options[index];
      if (element.classList.contains('selected')) {
        element.classList.remove("selected");
      }
    }
  }

  editQuestionData() {
    if (this.editQuestion.questionTypeId != 1) {
      this.getQuestionAnswer();
      if (this.questionAnswer.length == 0) {
        this.snackBarContent = "Please select an answer";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
      if (this.editQuestion.options.length == 0 && this.editQuestion.questionTypeId == 1) {
        this.snackBarContent = "Please select an answer";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
      this.addScoreToSelectedAnswer();
    }
    const data = this.editQuestion;
    data.questionTypeId = Number(data.questionTypeId);
    data.testTypeId = Number(data.testTypeId);
    data.questionImage = this.imageFile == null ? null : this.imageFile.name;
    data.u_date = new Date();
    data.u_id = Number(sessionStorage.getItem('userId'));
    console.log(data);
    this.adminService.updateQuestion(this.id, data).subscribe((res: any) => {
      if (res.message == "success") {
        // add the question image
        if (this.imageFile != null) {
          this.imageFormData.append(this.imageFile.name, this.imageFile);
          this.adminService.addQustionImage(this.imageFormData).subscribe((res) => {
            if (res.message === "success" && this.imageFile != null) {
              this.snackBarContent = "Question added successfully";
              this.showSnackbar('green', 'whitesmoke');
              return;
            }
            this.snackBarContent = "Error occured while uploading question image";
            this.showSnackbar('red', 'whitesmoke');
            return;
          });
        }
        this.snackBarContent = "Question updated successfully";
        this.showSnackbar('green', 'whitesmoke');
        return;
      }
      else {
        this.snackBarContent = "Error occured while updating question";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
    });
  }

  clickInputFile() {
    document.getElementById('questionImage')?.click();
  }

  getImageFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    let fileList: FileList | null = element.files!;
    if (fileList[0].type == 'image/png' || fileList[0].type == 'image/jpeg') {
      this.imageFile = fileList[0];
      this.imageFilePath = fileList[0].name;
      this.readmageData(this.imageFile);
    }
    else {
      this.imageFilePath = "Please select .png files or .jpeg files";
      this.showImage = false;
    }
  }

  readmageData(file: File) {
    // read image
    this.fileReader.readAsArrayBuffer(file);
    // read complete
    this.fileReader.onload = () => {
      const data: ArrayBuffer = this.fileReader.result as ArrayBuffer;
      this.imageData = new Uint8Array(data);
      var blob = new Blob([this.imageData], { 'type': 'image/png' });
      var url = URL.createObjectURL(blob);
      this.imageURL = url;
      setTimeout(() => {
      }, 120);
      this.showImage = true;
    };
  }

  snackBarContent: string = ''
  showSnackbar(backgroundColor: string, fontColor: string) {
    const x = document.getElementById("snackbar")!;
    x.className = "show";
    x.style.background = backgroundColor;
    x.style.color = fontColor;
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

}
