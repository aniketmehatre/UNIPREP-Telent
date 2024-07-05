import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'uni-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CvBuilderComponent implements OnInit {
  selectedResumeLevel: string = "";

  constructor(private toaster: MessageService) { }

  ngOnInit(): void {
  }

  imgOnclick(resumeLevel: any){
    // console.log(resumeLevel);
    this.selectedResumeLevel = resumeLevel;
  }

  shakeButton(event: Event) {
    if(!this.selectedResumeLevel){
      const button = event.target as HTMLElement;
      button.classList.add('shake');
      setTimeout(() => {
        button.classList.remove('shake');
      }, 300);

      this.toaster.add({severity: "error",summary: "Error",detail: "Please Select any one Resume model..!"})
    } 
  }
}
