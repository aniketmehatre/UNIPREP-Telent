import { Component, OnInit } from '@angular/core';
import { AcademicService } from '../academic.service';
import { AcademicToolCategory } from 'src/app/@Models/academic-tools.model';
import { CategoryResponse } from 'src/app/@Models/career-tool-category.model';


@Component({
  selector: 'uni-academic-tools',
  templateUrl: './academic-tools.component.html',
  styleUrls: ['./academic-tools.component.scss']
})
export class AcademicToolsComponent implements OnInit {
  moduleId = '15';
  academicTools: AcademicToolCategory[] = [];

  constructor(
    private academicService: AcademicService
  ) { }

  ngOnInit(): void {
    this.getAcademicToolList();
  }
  getAcademicToolList() {
    let req: { module_id: string } = {
      module_id: this.moduleId,
    }
    this.academicService.getAcademicToolList(req).subscribe((response: CategoryResponse) => {
      this.academicTools = response.data;
    });
  }
}
