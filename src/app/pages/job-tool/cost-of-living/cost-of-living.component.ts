import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard/dashboard.service';
interface City {
  name: string;
  code: string;
  flag: string;
}
@Component({
  selector: 'uni-cost-of-living',
  templateUrl: './cost-of-living.component.html',
  styleUrls: ['./cost-of-living.component.scss']
})
export class CostOfLivingComponent implements OnInit {
  countries: any[] = [];
  sourceCountry: City = { name: '', code: '', flag: '' };
  targetCountry: City = { name: '', code: '', flag: '' };
  filterValue: string = '';
  canShowComparision: boolean = false;
  comparisionDetails: any;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.dashboardService.countryList().subscribe((countryList:any) => {
      this.countries=countryList;
    });
  }

  resetFunction(options: any) {
    options.reset();
    this.filterValue = '';
  }

  customFilterFunction(event: KeyboardEvent, options: any) {
    options.filter(event);
  }
  compare() {
    this.canShowComparision = true;
    this.comparisionDetails = {};
  }

}
