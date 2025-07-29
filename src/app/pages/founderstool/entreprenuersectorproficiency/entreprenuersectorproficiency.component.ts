import { Component, OnInit } from '@angular/core';
import { FounderstoolService } from '../founderstool.service';
import { Router, RouterModule } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "../../../services/storage.service";
import { ButtonModule } from "primeng/button"
@Component({
  selector: 'uni-entreprenuersectorproficiency',
  templateUrl: './entreprenuersectorproficiency.component.html',
  styleUrls: ['./entreprenuersectorproficiency.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, ButtonModule]
})
export class EntreprenuersectorproficiencyComponent implements OnInit {
  categoryCount: number = 0;
  moduleID: number = 18;
  currentModuleSlug: any;
  constructor(private service: FounderstoolService, private router: Router,
    private pageFacade: PageFacadeService, private storage: StorageService
  ) { }
  ngOnInit(): void {

    var data = {
      page: 1,
      perpage: 10000,
      module_id: this.moduleID
    }
    this.getEntreprenuer(data);
  }
  etreprenuertestlists: any[] = [];
  getEntreprenuer(data: any) {
    this.service.getEntreprenuerTest(data).subscribe((response) => {
      this.etreprenuertestlists = [];
      this.etreprenuertestlists = response.data;
      this.categoryCount = response.count;
    });
  }
  openQuiz(id: any, name: string) {
    this.storage.set('conditionrevieworquiz', '0');
    this.storage.set('entrpreneursubid', id);
    this.storage.set('submodulename', name);
    this.currentModuleSlug = "entreprenuersectorproficiencytest"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }
  goBack() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }

  review(id: any) {
    this.storage.set('conditionrevieworquiz', '1')
    this.storage.set('entrpreneursubid', id)
    this.currentModuleSlug = "entreprenuersectorproficiencytest"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("entrepreneur-sector-procifiency-test");
  }
}
