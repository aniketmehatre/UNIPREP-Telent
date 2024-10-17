import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { GetAcademicListPayload } from 'src/app/@Models/academic-tools.model';
import { AcademicService } from '../academic.service';


@Component({
  selector: 'uni-academic-tools-stream',
  templateUrl: './academic-tools-stream.component.html',
  styleUrls: ['./academic-tools-stream.component.scss']
})
export class AcademicToolsStreamComponent implements OnInit {
  modulesList: any[] = []
  moduleId: string = '';
  isSkeletonVisible: boolean = false;
  loopRange = Array.from({ length: 30 }).fill(0).map((_, index) => index);
  currentModuleName: string = '';
  tooltip: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private academicService: AcademicService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(response => {
      this.moduleId = response['id'];
      switch (this.moduleId) {
        case '15': {
          this.currentModuleName = 'Grade 8';
          this.tooltip = 'Enhance your future academic journey with tailored tools for Grade 8.';
          break;
        }
        case '16': {
          this.currentModuleName = 'Grade 11'
          this.tooltip = 'Discover resources to strategically advance your learning in Grade 11.';
          break;
        }
        case '17': {
          this.currentModuleName = 'Grade 12'
          this.tooltip = 'Utilize essential tools to prepare effectively for your next steps after Grade 12.';
          break;
        }
        case '19': {
          this.currentModuleName = 'Grade 9'
          this.tooltip = 'Access key resources to shape your educational path in Grade 9.';
          break;
        }
        case '20': {
          this.currentModuleName = 'Grade 10'
          this.tooltip = 'Explore tools that pave the way for your academic progress in Grade 10.';
          break;
        }
      }
      this.getList();
    });
  }

  getList() {
    const params: GetAcademicListPayload = {
      module_id: this.moduleId,
    }
    this.academicService.getAcadamicSubModuleList(params).subscribe(res => {
      this.modulesList = res.data;
    });
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/pages/modules/academic-tools']);
    }
  }

  actionedrouteData: any = [];
  redirectTo(path: any) {
    if (path == "academic-tools") {
      this.route.navigate(["pages/modules/" + path]);
    }
    if (path === 'dashboard') {
      this.route.navigate(["pages/" + path]);
    }
  }

}
