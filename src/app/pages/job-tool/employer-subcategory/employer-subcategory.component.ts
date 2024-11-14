import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { GetSubcategoryPayload, SubCategoryResponse } from 'src/app/@Models/career-tool-category.model';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'uni-employer-subcategory',
  templateUrl: './employer-subcategory.component.html',
  styleUrls: ['./employer-subcategory.component.scss']
})
export class EmployerSubcategoryComponent implements OnInit {
  subCategories: any = [];
  module_id: string = "13";
  category_id: string = "";
  count: number = 0;
  employerMainName: any
  constructor(
    private testQuizService: TestQuizService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      localStorage.setItem("employerName", "");
      this.category_id = params['id'];
      this.getSubCategoryList();
    });
  }
  getSubCategoryList() {
    const params: GetSubcategoryPayload = {
      moduleId: this.module_id,
      categoryId: this.category_id,
    }
    this.testQuizService.getSubCategoryList(params).subscribe((res: SubCategoryResponse) => {
      this.subCategories = res.data;
      this.count = res.count;
    });
  }

  navigateToQuiz(category: any, categoryId: number): void {
    localStorage.setItem('employerName', category.category);
    localStorage.setItem('learningHubMainModuleName', category);
    this.router.navigate(['/pages/job-tool/quiz/employer/list', categoryId]);
  }

 
}
