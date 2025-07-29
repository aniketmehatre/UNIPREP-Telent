import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { StorageService } from "../../../services/storage.service";
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'uni-wealthleaderslist',
  templateUrl: './wealthleaderslist.component.html',
  styleUrls: ['./wealthleaderslist.component.scss'],
  standalone: true,
  imports: [SelectModule, CommonModule, RouterModule, FormsModule, ReactiveFormsModule, DialogModule, PaginatorModule, InputGroupModule, InputGroupAddonModule, InputTextModule,
    ButtonModule
  ],
})
export class WealthleaderslistComponent implements OnInit {
  valueNearYouFilter: string = '';
  filterForm: FormGroup
  wealthleaderlist: any[] = [];
  countries: any = [];
  newfile = "none";
  perpage: number = 50;
  pageno: number = 1;
  totalcount: number = 0;
  searchSubject = new Subject<string>();

  constructor(private router: Router, private pageFacade: PageFacadeService, private service: FounderstoolService,
    private storage: StorageService, private route: ActivatedRoute, private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      country: [null],
    });
    this.searchSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.getWealthLeaders();
    });
  }

  ngOnInit(): void {
    this.initWealthLeaders();
    this.service.getCountry().subscribe((res: any) => {
      this.countries = res;
    });
  }
  initWealthLeaders() {
    this.valueNearYouFilter = this.route.snapshot.queryParamMap.get('search') || '';
    if (this.route.snapshot.queryParamMap.get('country')) {
      this.filterForm.patchValue({
        country: Number(this.route.snapshot.queryParamMap.get('country'))
      });
    }
    this.getWealthLeaders();
  }

  goBack() {
    this.router.navigate(['/pages/education-tools']);
  }
  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("wealth-leaders");
  }
  performSearch() {
    this.searchSubject.next(this.valueNearYouFilter);
  }
  getWealthLeaders() {
    var data = {
      page: this.pageno,
      perPage: this.perpage,
      country: this.filterForm.value.country,
      search: this.valueNearYouFilter
    }
    this.service.wealthLeadersList(data).subscribe((res) => {
      this.wealthleaderlist = res.data;
      this.totalcount = res.total_count
      this.newfile = "none";
    })
  }
  filterPopUp() {
    this.newfile = "block";
  }
  resetFilter() {
    this.filterForm.reset();
    this.getWealthLeaders();
  }
  filtersubmit() {
    this.getWealthLeaders();
  }
  closenewfilePopup() {
    this.newfile = "none";
  }
  paginate(event: any) {
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    this.getWealthLeaders();
  }
  viewReadAns(id: any, name: any) {
    this.storage.set("wealthleadersname", name)
    this.router.navigate(['/pages/education-tools/wealthleaderreadanswer', id], { queryParams: { country: this.filterForm.value.country, search: this.valueNearYouFilter } });
  }
}
