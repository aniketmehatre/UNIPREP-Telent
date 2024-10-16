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
  folderdata: any = {};
  routedata: any = [];
  totalcount = 0;
  parentfolderlists: any = [];
  parentfilelists: any = [];
  titletext = "STARTUP KIT";

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
  getchildinfo(data: any) {
    if (data.isFolder == "2") {
      return;
    }
    this.folderdata.parent_id = data.id;
    if (data.parent_id == "0") {
      this.titletext = data.name;
    }
    this.routedata.push({
      id: data.id,
      name: data.name,
      data: data,
      path: "country",
    });
  }
  actionedrouteData: any = [];
  redirectTo(path: any) {
    if (path == "academic-tools") {
      this.folderdata.parent_id = "0";
      this.routedata = [];
      this.route.navigate(["pages/modules/" + path]);
    }
    if (path === 'dashboard') {
      this.route.navigate(["pages/" + path]);
    }
  }

}
