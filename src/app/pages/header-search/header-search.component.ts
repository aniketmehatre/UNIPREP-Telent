import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";

@Component({
  selector: 'uni-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }
  isSearchResultFound: boolean = false;
  searchResult: any;
  ngOnInit(): void {
  }

  onSearchChange(event: any) {
    event == "" ? this.isSearchResultFound = false : '';
  }

  searchKeyWord(searchInput: any) {
    const data = {
      countryId: 2,
      searchtag: searchInput.value
    }
    this.dashboardService.searchKeyword(data).subscribe((res: any) => {
      if (res.status === 404) {
        return;
      }
      this.isSearchResultFound = true;
      this.searchResult = res.questions;
    }, err => {
      console.log('err', err);

    });
  }
}
