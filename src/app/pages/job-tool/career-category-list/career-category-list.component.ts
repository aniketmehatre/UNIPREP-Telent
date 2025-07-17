import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryResponse, GetCategoriesPayload } from 'src/app/@Models/career-tool-category.model';
import { EmployerGlobalService } from '../employer-global.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { StorageService } from "../../../services/storage.service";
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'uni-career-category-list',
  templateUrl: './career-category-list.component.html',
  styleUrls: ['./career-category-list.component.scss'],
  standalone: true,
  imports: [CommonModule, PaginatorModule]
})
export class CareerCategoryListComponent implements OnInit {
  categories: any = [];
  module_id: string = '11';
  first: number = 1;
  page: number = 1;
  rows: number = 50;
  count: number = 0;

  constructor(
    private testQuizService: TestQuizService,
    private router: Router, private employerGlobalService: EmployerGlobalService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService, private storage: StorageService
  ) {
    this.storage.set('MainTitleCareerTool', "");
  }

  ngOnInit(): void {
    this.employerGlobalService.clearAll();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.storage.set('MainTitleCareerTool', "");
      this.module_id = params['id'];
      this.getCategoryList();
    });
  }
  getCategoryList() {
    const params: GetCategoriesPayload = {
      moduleId: this.module_id,

    }
    if (this.module_id === '13') {
      params.page = this.page,
        params.perpage = this.rows
    }
    this.testQuizService.getCategoryList(params).subscribe((res: CategoryResponse) => {
      this.categories = res.data;
      this.count = res.count;
    });
  }
  navigate(category: any, category_id: number) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    let moduleUrl = "";
    switch (this.module_id) {
      case '11':
        moduleUrl = "psychometric";
        break;
      case '12':
        moduleUrl = "personality";
        break;
      case '13':
        moduleUrl = "employer-sub-test";
        break;
    }

    this.employerGlobalService.addItem(category.category);
    this.storage.set('MainTitleCareerTool', category.category)
    if (this.module_id != '13') {
      this.router.navigate([`/pages/job-tool/quiz/${moduleUrl}/list`, category_id]);
    } else {
      this.router.navigate([`/pages/job-tool/${moduleUrl}`, category_id]);
    }
  }
  pageChange(event: any) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.first = event.page;
    if (this.module_id === '13') {
      this.page = event.page + 1;
      this.rows = event.rows;
    }
    this.getCategoryList();
  }
}
