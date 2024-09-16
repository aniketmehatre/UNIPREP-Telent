import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryResponse, GetCategoriesPayload } from 'src/app/@Models/career-tool-category.model';

@Component({
  selector: 'uni-career-category-list',
  templateUrl: './career-category-list.component.html',
  styleUrls: ['./career-category-list.component.scss']
})
export class CareerCategoryListComponent implements OnInit {
  categories: any = [];
  module_id: string = '11';
  first: number = 1;
  page: number = 1;
  rows: number = 50;
  moduleName: string = "pshychometric";
  count: number = 0;



  constructor(
    private testQuizService: TestQuizService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
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
  navigate(category_id: number) {
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
    if (this.module_id != '13') {
      this.router.navigate([`/pages/job-tool/quiz/${moduleUrl}/list`, category_id]);
    } else {
      this.router.navigate([`/pages/job-tool/${moduleUrl}`, category_id]);
    }
  }
  pageChange(event: any) {
    this.first = event.page;
    if (this.module_id === '13') {
      this.page = event.page + 1;
      this.rows = event.rows;
    }
    this.getCategoryList();
  }
}
