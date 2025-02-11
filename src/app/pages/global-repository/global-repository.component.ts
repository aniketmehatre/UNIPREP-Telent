import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { DialogModule } from 'primeng/dialog';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'uni-global-repository',
  templateUrl: './global-repository.component.html',
  styleUrls: ['./global-repository.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, DropdownModule, SkeletonModule, TooltipModule] 
})
export class GlobalRepositoryComponent implements OnInit {
  isSkeletonVisible: boolean = false
  howItWorksVideoLink: string = ''
  description: string = ''
  updatedMenuNameLifeAt: string = ''
  globalRepoList: any[] = []
  selectedCountryName: any;
  countryLists: any[] = []
  selectedCountryId: any;
  constructor(private router: Router, private dataService: DataService,
    private locationService: LocationService
  ) {
    this.dataService.countryNameSource.subscribe((countryName) => {
      this.updatedMenuNameLifeAt = countryName;
      this.globalRepoList = [{
        id: 1,
        name: 'Pre-Admission',
        icon: 'https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/PreAdmission.svg',
        url: '/pages/modules/pre-admission'
      }, {
        id: 2,
        name: 'Post Admission',
        icon: 'https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/PostAdmission.svg',
        url: '/pages/modules/post-admission'
      }, {
        id: 3,
        name: 'Universities',
        icon: 'https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/University.svg',
        url: '/pages/modules/university'
      },
      {
        id: 4,
        name: 'Career Hub',
        icon: 'https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CareerHub.svg',
        url: '/pages/modules/career-hub'
      },
      {
        id: 5,
        name: 'Travel & Tourism',
        icon: 'https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/TravelTourism.svg',
        url: '/pages/modules/travel-and-tourism'
      },
      {
        id: 6,
        name: 'Life In ' + this.updatedMenuNameLifeAt,
        icon: 'https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/LifeAt.svg',
        url: '/pages/modules/life-at-country'
      }]
    });
  }

  ngOnInit() {
    
      this.locationService.dashboardLocationList().subscribe((countryList: any) => {
          this.countryLists = countryList
      });
  }

  selectCountry(selectedId: any): void {
    this.countryLists.forEach((element: any) => {
        if (element.id === selectedId.id) {
            this.selectedCountryName = element.country;
        }
    });
    this.countryLists.forEach((item: any, i: any) => {
        if (item.id === selectedId.id) {
            this.countryLists.splice(i, 1);
            this.countryLists.unshift(item);
        }
    });

    localStorage.setItem('countryId', selectedId.id);
    localStorage.setItem('selectedcountryId', selectedId.id);
    this.selectedCountryId = selectedId.id;
    this.dataService.changeCountryId(selectedId.id);
    this.dataService.changeCountryFlag(selectedId.flag)
    this.dataService.changeCountryName(selectedId.country)

}

  openVideoPopup(videoUrl: any) {

  }

  goBack() {

  }

  onSubModuleClick(data: any) {
    this.router.navigateByUrl(data.url);
  }
}
