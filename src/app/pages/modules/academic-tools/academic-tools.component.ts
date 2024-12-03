import { Component, OnInit } from '@angular/core';
import { AcademicService } from '../academic.service';
import { AcademicToolCategory } from 'src/app/@Models/academic-tools.model';
import { CategoryResponse } from 'src/app/@Models/career-tool-category.model';
import { Router } from '@angular/router';


@Component({
  selector: 'uni-academic-tools',
  templateUrl: './academic-tools.component.html',
  styleUrls: ['./academic-tools.component.scss']
})
export class AcademicToolsComponent implements OnInit {
  moduleId = '15';
  academicTools: AcademicToolCategory[] = [];
  isSkeletonVisible: boolean = true;
  loopRange = [0,1,2];

  constructor(
    private academicService: AcademicService, private router: Router
  ) { }

  ngOnInit(): void {
    this.getAcademicToolList();
  }

  gotoNE() {
    this.router.navigate(['/pages/national-exams']);
  }
  getAcademicToolList() {
    let req: { module_id: string } = {
      module_id: this.moduleId,
    }
    this.academicService.getAcademicToolList(req).subscribe((response: CategoryResponse) => {
      this.academicTools = response.data;
      this.isSkeletonVisible = false;
    });
  }

  navigateToTool(id: any) {
    if (id) {
      // Navigate dynamically

      this.router.navigateByUrl(`pages/modules/academic-tools/${id}`);
    }
  }
}
