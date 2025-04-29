import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import { learnModules, learnsubModules, primary_question, Quizmodule, SelectedOption, shuffledQuestion, submoduledata } from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";
import { Router } from "@angular/router";
import { Track } from "ngx-audio-player";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "uni-quizwindow",
  templateUrl: "./quizwindow.component.html",
  styleUrls: ["./quizwindow.component.scss"],
  standalone: false,
})
export class QuizwindowComponent implements OnInit {
  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() quizwindowvisibility: boolean;
  @Input() selected_module: string;
  @Input() totalquestion: number;
  @Output() moduleChange = new EventEmitter();
  @Output() visibilityChange = new EventEmitter();
  constructor(private pageFacade: PageFacadeService, private router: Router, private learnService: UniLearnService, private fb: FormBuilder, private toast: MessageService) {}
  paramData: any;
  activeQuestion: number = 0;
  quizprimaryAudio: Track[] = [{ title: "", link: "", mediaType: "" }];
  displayTitle = false;
  autoplay = true;
  disablePositionSlider = true;
  displayRepeatControls = false;
  displayVolumeControls = true;
  displayVolumeSlider = true;
  istypeAudio = false;
  istypeParagraph = false;
  istypeImage = false;
  @ViewChild("audioplayer") audioplayer: any;
  quizForm: any = FormGroup;
  isSkeletonVisible: boolean = true;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  ngOnInit(): void {
    this.quizForm = this.fb.group({
      module_id: new FormControl(),
      test_type_module_id: new FormControl(),
      test_module_id: new FormControl(),
      questions: this.fb.array([]),
    });
    this.paramData = { test_module_id: this.parentid };
    this.getquestions();
  }
  paragraphQuestion = "";
  paragraphTittle = "";
  imageQuestion = "";
  imageTittle = "";
  quizLength = 0;
  get questionsFormArray(): FormArray {
    return this.quizForm.get("questions") as FormArray;
  }
  getquestions() {
    this.istypeAudio = false;
    this.istypeParagraph = false;
    this.istypeImage = false;
    this.learnService.getQuestions(this.paramData).subscribe((res: Quizmodule) => {
      this.quizLength = res.shuffledQuestion.length;
      this.quizForm.patchValue({
        module_id: res.shuffledQuestion[0].module_id,
        test_type_module_id: res.shuffledQuestion[0].test_type_module_id,
        test_module_id: res.shuffledQuestion[0].test_module_id,
        question_id: res.shuffledQuestion[0].id,
      });
      res.shuffledQuestion.forEach((question: shuffledQuestion) => {
        const questionGroup = this.fb.group({
          id: new FormControl(question.id),
          question_type: new FormControl(question.type_id),
          question: new FormControl(question.question),
          type: new FormControl(question.type),
          answer: new FormControl(""),
          options: new FormControl([]),
          selectedOptions: new FormControl([]),
          selectedOption: new FormControl(null),
        });
        if (question.type === "Fill in the Blank" || question.type === "One Word" || question.type === "Q&A" || question.type === "Write a Letter" || question.type === "Essay" || question.type === "Summarize Chart/Diagram/Table" || question.type === "Summarize Information") {
          this.questionsFormArray.push(
            this.fb.group({
              id: question.id,
              question_type: question.type_id,
              question: question.question,
              answer: [""],
              type: question.type,
            })
          );
        } else if (question.type === "MCQ") {
          this.questionsFormArray.push(
            this.fb.group({
              id: question.id,
              question_type: question.type_id,
              type: question.type,
              question: question.question,
              options: [question.options],
              selectedOptions: [],
            })
          );
        } else if (question.type === "True or False") {
          this.questionsFormArray.push(
            this.fb.group({
              id: question.id,
              question_type: question.type_id,
              type: question.type,
              question: question.question,
              options: this.fb.control(["True", "False"]),
              selectedOption: [],
            })
          );
        }
      });
      res.primary_question.forEach((pquestions: primary_question) => {
        if (pquestions.audio == 1) {
          this.istypeAudio = true;
          setTimeout(() => {
            this.audioplayer.volume = 1;
            this.quizprimaryAudio[0].link = pquestions.audio_file;
            this.audioplayer.play();
          }, 3000);
        }
        if (pquestions.paragraph == 1) {
          this.istypeParagraph = true;
          this.paragraphTittle = pquestions.title;
          this.paragraphQuestion = pquestions.description;
        }
        if (pquestions.image == 1) {
          this.istypeImage = true;
          this.imageTittle = pquestions.title;
          this.imageQuestion = pquestions.image_file;
        }
      });
    });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  QuestionSequence(n: number): Array<number> {
    return new Array(n);
  }
  btn_previousclick() {
    // stop();
    if (this.activeQuestion == 0) {
      this.quizwindowvisibility = false;
      this.visibilityChange.emit(this.quizwindowvisibility);
    }
  }

  selectedOptions: SelectedOption[] = [];
  onCheckboxChange(event: any, questionindex: any, optionindex: number) {
    questionindex = questionindex + 1;
    optionindex = optionindex + 1;
    if (event.target.checked) {
      const existingQuestion = this.selectedOptions.find((option) => option.question === questionindex);
      if (existingQuestion) {
        if (!existingQuestion.options.includes(optionindex)) {
          existingQuestion.options.push(optionindex);
        }
      } else {
        this.selectedOptions.push({
          question: questionindex,
          options: [optionindex],
        });
      }
    } else {
      const existingQuestion = this.selectedOptions.find((option) => option.question === questionindex);

      if (existingQuestion) {
        existingQuestion.options = existingQuestion.options.filter((option) => option !== optionindex);

        if (existingQuestion.options.length === 0) {
          this.selectedOptions = this.selectedOptions.filter((option) => option.question !== questionindex);
        }
      }
    }
  }
  submitTest() {
    const formValue = this.quizForm.value;
    let quizdata: any = [];
    formValue?.questions?.forEach((quiz: any, index: number) => {
      let quizindex = index + 1;
      let quizobj: any = {
        id: quiz.id,
        question: quiz.question,
        question_type: quiz.question_type,
      };
      if (quiz.answer) {
        quizobj.useranswer = quiz.answer || "";
      } else {
        if (quiz.selectedOption) {
          quizobj.useranswer = quiz.selectedOption == "True" ? "1" : "0";
        } else {
          const existingQuestion = this.selectedOptions.find((option) => option.question === quizindex);
          quizobj.options = [...(quiz?.options || [])];
          quizobj.useranswer = existingQuestion?.options.join(",") || "";
        }
      }
      quizdata.push(quizobj);
    });
    var submitdata = {
      module_id: formValue.module_id,
      test_module_id: formValue.test_module_id,
      test_type_module_id: formValue.test_type_module_id,
      quizquestion: [...quizdata],
    };
    this.learnService.submittestAnswers(submitdata).subscribe(
      (data) => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Test Submitted Successfully",
        });
        if (this.activeQuestion == 0) {
          this.quizwindowvisibility = false;
          this.visibilityChange.emit(this.quizwindowvisibility);
        }
      },
      (error: any) => {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error,
        });
      }
    );
  }
}
