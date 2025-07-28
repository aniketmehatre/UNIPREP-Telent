import { EmployerGlobalService } from './../employer-global.service';
import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { GetSubcategoryPayload, SubCategoryResponse } from 'src/app/@Models/career-tool-category.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { StorageService } from "../../../services/storage.service";
@Component({
  selector: 'uni-employer-subcategory',
  templateUrl: './employer-subcategory.component.html',
  styleUrls: ['./employer-subcategory.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule]

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
    private router: Router, private employerGlobalService: EmployerGlobalService,
    private authService: AuthService,
    private locationService: LocationService, private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.storage.set("employerName", "");
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
    this.employerGlobalService.addItem(category.category)
    this.storage.set('employerName', category.category);
    this.storage.set('learningHubMainModuleName', category);
    this.router.navigate(['/pages/job-tool/quiz/employer/list', categoryId]);
  }

}
