import { Component, OnInit } from '@angular/core';
import { NationalExamService } from './national-exam.service';
import { Router } from '@angular/router';
import { Location } from "@angular/common"
import {StorageService} from "../../services/storage.service";

@Component({
    selector: 'uni-national-exam-categories',
    templateUrl: './national-exam-categories.component.html',
    styleUrls: ['./national-exam-categories.component.scss'],
    standalone: false
})
export class NationalExamCategoriesComponent implements OnInit {
  categories: any;

  constructor(private service: NationalExamService , private router: Router, private location: Location,
              private storage: StorageService) { }

  ngOnInit(){

      this.service.getCategories().subscribe(response => {
        this.categories = response;
      });

  }

  goToHome(event: any) {
		this.location.back()
	}

  openTest(category:any){
    // alert(id);
    this.storage.set('nc-name', category.name);
    this.router.navigate(['/pages/national-exams/'+category.id]);
  }
}
