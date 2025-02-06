import { EmployerGlobalService } from './../employer-global.service';
import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { GetSubcategoryPayload, SubCategoryResponse } from 'src/app/@Models/career-tool-category.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
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
    private locationService: LocationService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      localStorage.setItem("employerName", "");
      this.category_id = params['id'];
      this.getSubCategoryList();
    });
    this.checkplanExpire()
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
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
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.employerGlobalService.addItem(category.category)
    localStorage.setItem('employerName', category.category);
    localStorage.setItem('learningHubMainModuleName', category);
    this.router.navigate(['/pages/job-tool/quiz/employer/list', categoryId]);
  }
  planExpired: boolean = false;
  restrict: boolean = false;  
  ehitlabelIsShow: boolean = true;
  orgnamewhitlabel: any;
  orglogowhitelabel:any;
  imagewhitlabeldomainname: any
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan=="Student") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  clearRestriction() {
    this.restrict = false;
  }
 
}
