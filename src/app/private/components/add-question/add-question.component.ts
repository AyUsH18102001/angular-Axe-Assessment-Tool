import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AdminAddOption } from 'src/models/adminAddOption';
import { AdminAddQuestion } from 'src/models/adminAddQuestion';
import { DomSanitizer } from '@angular/platform-browser';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { AdminUiServiceService } from '../../services/admin-ui-service.service';
import { TestType } from 'src/models/testType';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  //Icons
  download = faDownload;
  upload = faUpload;
  close = faClose;

  addQuestion: AdminAddQuestion = {
    questionContent: '',
    questionTypeId: 0,
    testTypeId: 0,
    options: [],
    questionImage: null
  }
  addQuestionOptions: string[] = [];

  questionTypes: {
    questionTypeId: 0,
    short_name: '',
    type: ''
  }[] = [];
  testTypes: TestType[] = [];

  showOptions: boolean = false;
  showOptionInput: boolean = true;
  questionAnswer: number[] = [];

  imageFilePath: string = '';
  imageFormData: FormData = new FormData();
  imageFile!: File;
  imageURL: string = '';

  showImage: boolean = false;
  fileReader: FileReader = new FileReader();
  imageData: Uint8Array = new Uint8Array();
  imagePathBase64: string | null = '';
  

  @ViewChild('questionForm') questionForm!: NgForm;
  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    // get all the questiontTypes
    this.adminService.getAllQuestionType().subscribe((res: any) => {
      this.questionTypes = res;
    });

    // get all the test types
    this.adminService.getTestTypes().subscribe((res) => {
      this.testTypes = res;
    });
  }

  options: string[] = [];
  questionTypeSelected() {
    console.log(this.addQuestion.questionTypeId);

    if (Number(this.addQuestion.questionTypeId) != 0) {
      this.showOptions = true;
      this.showOptionInput = true;
    }
    if (Number(this.addQuestion.questionTypeId) == 1) {
      this.options = Array(2).fill("");
      this.showOptionInput = false;
    }
    if (Number(this.addQuestion.questionTypeId) > 1) {
      this.options = Array(4).fill("")
    }
  }

  selectOptionAsAnswer(index: number) {
    const option = document.getElementById(`select-${index}`);

    if (this.addQuestion.questionTypeId == 4) {
      if (!option?.classList.contains('selected')) {
        option?.classList.add('selected');
      }
      else {
        option?.classList.remove('selected');
      }
    }
    else {
      const optionBlob = document.getElementsByClassName('selectBlob');
      for (let i = 0; i < optionBlob.length; i++) {
        if (optionBlob[i].classList.contains('selected')) {
          optionBlob[i].classList.remove('selected');
        }
        if (i === index) {
          optionBlob[i].classList.add('selected');
        }
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
      this.addQuestion.options = [];
      this.addQuestion.options = options;
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
      this.addQuestion.options = [];
      this.addQuestion.options = options;
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

  changeOptionsObjectToAnswer() {
    for (let index = 0; index < this.addQuestion.options.length; index++) {
      this.addQuestionOptions[index] = this.addQuestion.options[index].answer;
    }
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

  addScoreToSelectedAnswer() {
    const options: AdminAddOption[] = [];
    for (let index = 0; index < this.addQuestionOptions.length; index++) {
      if (this.questionAnswer.includes(index)) {
        const option: AdminAddOption = {
          score: 10,
          answer: this.addQuestionOptions[index]
        }
        options.push(option)
      }
      else {
        const option: AdminAddOption = {
          score: 0,
          answer: this.addQuestionOptions[index]
        }
        options.push(option)
      }
    }
    this.addQuestion.options = [];
    this.addQuestion.options = options;
  }

  getQuestionAnswer() {
    const optionBlob = document.getElementsByClassName('selectBlob');
    for (let index = 0; index < optionBlob.length; index++) {
      if (optionBlob[index].classList.contains('selected')) {
        this.questionAnswer.push(index);
      }
    }
  }

  addQuestionData() {
    if (this.addQuestion.questionTypeId != 1) {
      this.getQuestionAnswer();
      if (this.questionAnswer.length == 0) {
        this.snackBarContent = "Please give an answer";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
      if (this.addQuestion.options.length == 0 && this.addQuestion.questionTypeId == 1) {
        this.snackBarContent = "Please give an answer";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
      this.addScoreToSelectedAnswer();
    }
    if (this.addQuestion.testTypeId == 0) {
      this.snackBarContent = "Please select test type";
      this.showSnackbar('red', 'whitesmoke');
      return;
    }

    const data = this.addQuestion;
    data.questionTypeId = Number(data.questionTypeId);
    data.testTypeId = Number(data.testTypeId);
    data.questionImage = this.imageFile == null ? null : this.imageFile.name;
    data.i_date = new Date();
    data.i_id = Number(sessionStorage.getItem("userId"));
    this.adminService.addQuestion(data).subscribe((res: any) => {
      if (res.error) {
        this.snackBarContent = "Question already esists";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
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
        this.snackBarContent = "Question added successfully";
        this.showSnackbar('green', 'whitesmoke');
        return;
      }
      else {
        this.snackBarContent = "Error occured while uploading question";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
    });
  }

  removeImage(){
    this.imageFile = null as unknown as File;
    this.showImage = false;
    this.imageFilePath = '';
  }

  clickInputFile() {
    document.getElementById('questionImage')?.click();
  }

  csv = '';
  clickExceFile() {
    document.getElementById("excelFile")?.click();
    this.csv = ''; // to clear the value of the input file
  }

  removeCSV(){
    this.excelFile = null as unknown as File;
    this.excelFilePath = '';
  }

  excelFilePath: string = '';
  excelFileReader: FileReader = new FileReader();
  excelFile!: File;

  fileRows: string[] = [];
  bulkQuestions: AdminAddQuestion[] = [];
  scoreNotGiven = true;
  invalidQuestionType = true;
  invalidTestType = true;

  getExcelFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files!;
    const file: File = fileList[0];
    if (file == null) {
      return;
    }
    if (file.type == 'text/csv') {
      this.excelFile = file;
      this.readExcelFile(this.excelFile);
    }
  }

  downloadCSV() {
    this.adminService.downloadFormat().subscribe((res) => {
      console.log(res);
    });
  }

  // csv file level-1 filtering
  level1Filtering() {
    const headers: string = this.fileRows[0];
    const predefinedHeaderRow = ['Content', 'TestTypeId', 'QuestionTypeId', 'Option-1', 'Option-2']; //  minimum two options
    const headerRow: string[] = headers.split(',');
    for (let index = 0; index < headerRow.length; index++) {
      if (index >= predefinedHeaderRow.length) {
        // check the rest of headers
        if (!headerRow[index].includes('Option')) {
          this.snackBarContent = "Format not supported";
          this.showSnackbar('red', 'whitesmoke');
          return;
        }
      }
      if (headerRow[index] != predefinedHeaderRow[index] && index < predefinedHeaderRow.length) {
        this.snackBarContent = "Format not supported";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
    }
  }

  // filter-2 and serializing to model
  filterAndSerialize(): AdminAddQuestion[] {
    let questions: AdminAddQuestion[] = []
    let questionRow: string = '';
    let options: AdminAddOption[] = [];

    // get the typeid from the tf,mcq and ms types


    for (let i = 0; i < this.fileRows.length; i++) {
      const element = this.fileRows[i];
      if (i != 0) {
        questionRow = element;

        let question: AdminAddQuestion = {
          questionContent: '',
          questionTypeId: 0,
          questionImage: null,
          testTypeId: 0,
          options: []
        };

        let rowSplit = questionRow.split(',');
        if (rowSplit.length > 1) {
          for (let index = 0; index < rowSplit.length; index++) {
            const rowItem = rowSplit[index];
            // 2- level filtering -- check the row items
            if (rowItem != '' && rowItem.toLocaleLowerCase() != 'null') {
              if (index == 0) { // questionContent
                question.questionContent = rowItem;
              }
              if (index == 1) { // testTypeId              
                let type: any = this.testTypes.filter((element) => {
                  return element.short_name == rowItem
                });

                if (type.length != 0) {
                  question.testTypeId = type[0].testTypeId;
                  this.invalidTestType = false;
                }
                else {
                  this.invalidTestType = true;
                  // clear the excel file path, so the upload wont be shown
                  this.excelFilePath = '';
                  questions = [];
                  break;
                }
              }
              if (index == 2) { // questionTypeId              
                let type: any = this.questionTypes.filter((element) => {
                  return element.short_name == rowItem
                });
                if (type.length != 0) {
                  question.questionTypeId = type[0].questionTypeId;
                  this.invalidQuestionType = false;
                }
                else {
                  this.invalidQuestionType = true;
                  this.excelFilePath = '';
                  questions = [];
                  break;
                }
              }
              if (index > 2) { //options
                let option: AdminAddOption = {
                  answer: '',
                  score: 0
                };
                let option_Answer_Score = rowItem.split('-');

                if (option_Answer_Score.length == 1) {
                  option.answer = option_Answer_Score[0];
                  option.score = 0;
                  options.push(option);
                  question.options = options;
                }
                else if (option_Answer_Score.length == 2) {
                  option.answer = option_Answer_Score[0];
                  option.score = Number(option_Answer_Score[1]);
                  options.push(option);
                  question.options = options;
                }
              }
              if (index == rowSplit.length - 1) {
                // check that a score has been given for a question
                for (let index = 0; index < question.options.length; index++) {
                  const option: AdminAddOption = question.options[index];
                  if (option.score != 0) {
                    this.scoreNotGiven = false;
                  }
                }
              }
            }
          }
        }
        if (i < this.fileRows.length - 1 && !this.scoreNotGiven && !this.invalidQuestionType && !this.invalidTestType) {
          // add question
          questions.push(question);
          options = [];
        }
        else {
          break;
        }
      }
    }
    this.excelFilePath = this.excelFile.name;
    return questions;
  }

  questions: AdminAddQuestion[] = []
  readExcelFile(file: File) {
    console.log('read excel file');

    this.excelFileReader.readAsText(file, "UTF-8");
    this.excelFileReader.onload = () => {
      const rows = this.excelFileReader.result?.toString().split('\n')!;
      for (let index = 0; index < rows.length; index++) {
        this.fileRows[index] = rows[index];
      }

      // level - 1 filtering (check is the file format correct)
      this.level1Filtering();

      // now filtering and serializing the rows to AdminAddQuetsion Model
      this.questions = this.filterAndSerialize();

      // add bulk question
      if (this.questions.length == 0) {
        if (this.scoreNotGiven) {
          this.snackBarContent = "Please give score to atleast one option";
          this.showSnackbar('red', 'whitesmoke');
          return;
        }
        else if (this.invalidQuestionType) {
          this.snackBarContent = "Check the format of Question Type Id";
          this.showSnackbar('red', 'whitesmoke');
          return;
        }
        else if (this.invalidTestType) {
          this.snackBarContent = "Check the format of Test Type Id";
          this.showSnackbar('red', 'whitesmoke');
          return;
        }
      }
      else{
        this.snackBarContent = "Bulk Question CSV frmat is valid";
        this.showSnackbar('green', 'whitesmoke');
        return;
      }
    };
  }

  uploadBulkQuestions() {
    this.uploadBulkQuestions_helper(this.questions);
  }

  uploadBulkQuestions_helper(questions: AdminAddQuestion[]) {
    this.adminService.addBulkQuestions(questions).subscribe((res: any) => {
      console.log(res);
      if (res.error) {
        this.snackBarContent = "Please remove the duplicate Questions";
        this.showSnackbar('red', 'whitesmoke');
        return;
      }
      if (res.message == "success") {
        this.snackBarContent = "Bulk question added successfully";
        this.showSnackbar('green', 'whitesmoke');
        return;
      }
    });
  }

  getImageFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    let fileList: FileList | null = element.files!;
    if (fileList[0].type == 'image/png' || fileList[0].type == 'image/jpeg' || fileList[0].type == 'image/gif') {
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
