import { Component, OnInit } from '@angular/core';
import { NationalExamService } from './national-exam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-national-exam-categories',
  templateUrl: './national-exam-categories.component.html',
  styleUrls: ['./national-exam-categories.component.scss']
})
export class NationalExamCategoriesComponent implements OnInit {
  categories: any;

  constructor(private service: NationalExamService , private router: Router) { }

  ngOnInit(){

      this.service.getCategories().subscribe(response => {
        this.categories = response;
      });

  }

  openTest(id:number){
    this.router.navigate(['/national-exam/id']);
  }
}
