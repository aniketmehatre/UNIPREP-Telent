import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { DataService } from "src/app/services/data.service";
import { LocationService } from "src/app/services/location.service";
import { DropdownModule } from "primeng/dropdown";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { SelectModule } from "primeng/select";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { StorageService } from "../../services/storage.service";
import { Carousel } from "primeng/carousel";
@Component({
  selector: "uni-global-repository",
  templateUrl: "./global-repository.component.html",
  styleUrls: ["./global-repository.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    DropdownModule,
    SkeletonModule,
    TooltipModule,
    SelectModule,
    FormsModule,
    Carousel,
  ],
})
export class GlobalRepositoryComponent implements OnInit {
  isSkeletonVisible: boolean = false;
  howItWorksVideoLink: string = "";
  description: string = "";
  updatedMenuNameLifeAt: string = "";
  globalRepoList: any[] = [];
  selectedCountryName: any;
  countryLists: any[] = [];
  selectedCountryId: any;
  responsiveOptions: any
  myForm = new FormGroup({
    selectedCountryId: new FormControl(null), // Initialize to null
  });
  constructor(
    private router: Router,
    private dataService: DataService,
    private locationService: LocationService,
    private cdRef: ChangeDetectorRef,
    private storage: StorageService,
  ) {
    this.selectedCountryId = this.storage.get("countryId")
    this.dataService.countryNameSource.subscribe((countryName) => {
      this.updatedMenuNameLifeAt = countryName;
      this.globalRepoList = [
        {
          id: 1,
          name: "Pre-Admission",
          icon: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/PreAdmission.svg",
          url: "/pages/modules/pre-admission",
        },
        {
          id: 2,
          name: "Post Admission",
          icon: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/new/Postadmission.svg",
          url: "/pages/modules/post-admission",
        },
        {
          id: 3,
          name: "Universities",
          icon: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/new/Universities.svg",
          url: "/pages/modules/university",
        },
        {
          id: 4,
          name: "Career Hub",
          icon: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/new/CareerHub.svg",
          url: "/pages/modules/career-hub",
        },
        {
          id: 5,
          name: "Travel & Tourism",
          icon: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/new/travelandtourism.svg",
          url: "/pages/modules/travel-and-tourism",
        },
        {
          id: 6,
          name: "Life In " + this.updatedMenuNameLifeAt,
          icon: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/new/Lifeat.svg",
          url: "/pages/modules/life-at-country",
        },
      ];
    });
    this.responsiveOptions = [
      {
        breakpoint: "1199px",
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: "991px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 1,
        numScroll: 1,
      },
    ]
  }

  ngOnInit() {
    this.locationService
      .getCountry()
      .subscribe((countryList: any) => {
        this.countryLists = countryList;
        const storedCountryId = Number(this.storage.get("countryId")) || 0;
        // Set the selectedCountryId after the API call
        this.selectedCountryId = storedCountryId;
        let currentSelectedCountry = this.countryLists.find((element: any) => storedCountryId == element.id)
        this.selectedCountryName = currentSelectedCountry.country;
        // To make sure the dropdown updates, you might need to manually trigger change detection
        this.cdRef.detectChanges();
      });
  }

  selectCountry(selectedId: any) {
    this.countryLists.forEach((element: any) => {
      if (element.id === selectedId) {
        this.selectedCountryName = element.country;
        this.storage.set("countryId", element.id);
        this.storage.set("selectedcountryId", element.id);
        this.selectedCountryId = element.id;
        this.dataService.changeCountryId(element.id);
        this.dataService.changeCountryFlag(element.flag);
        this.dataService.changeCountryName(element.country);
      }
    });
    this.countryLists.forEach((item: any, i: any) => {
      if (item.id === selectedId) {
        this.countryLists.splice(i, 1);
        this.countryLists.unshift(item);
      }
    });
  }

  openVideoPopup(videoUrl: any) { }

  goBack() { }

  onSubModuleClick(data: any) {
    this.router.navigateByUrl(data.url);
  }

}
