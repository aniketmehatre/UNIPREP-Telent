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
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private academicService: AcademicService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(response => {
      this.moduleId = response['id'];
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

}
