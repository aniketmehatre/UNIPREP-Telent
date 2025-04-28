import { Component, ElementRef, HostListener, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { ArrayHeaderService } from "../../unilearn/array-header.service";
import { JobseekerSuccessStoriesService } from "../job-seeker-success-stories.service";
import { PageFacadeService } from "../../page-facade.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from "src/app/Auth/auth.service";

@Component({
  selector: "uni-seekercountries",
  templateUrl: "./seekercountries.component.html",
  styleUrls: ["./seekercountries.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    RouterModule,
    CardModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    ButtonModule,
    MultiSelectModule,
    SelectModule,
    InputGroupModule,
    InputTextModule,
    InputGroupAddonModule,
    SkeletonModule
  ]
})
export class SeekercountriesComponent implements OnInit {
  constructor(
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private service: JobseekerSuccessStoriesService,
    private pageFacade: PageFacadeService,
    private authService: AuthService
  ) { }

  isSkeletonVisible: boolean = true;
  moduleList: any[] = [];
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 }).fill(0).map((_, index) => index);

  ngOnInit(): void {
    console.log('SeekercountriesComponent initialized');
    this.init();
    this.arrayHeaderService.clearAll();
  }

  init() {
    console.log('Fetching job seeker stories countries...');
    this.service.getjobseekerstoriesCountries().subscribe({
      next: (res: any) => {
        console.log('Received countries:', res);
        this.isSkeletonVisible = false;
        this.moduleList = res;
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
        this.isSkeletonVisible = false;
      }
    });
  }

  backtoMain() {
    this.router.navigateByUrl("/pages/job-tool/career-tool");
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  onModuleClick(moduledata: any) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    const data = {
      country_id: moduledata.id,
      countryName: moduledata.country,
      stage: 2,
    };
    this.prepData = data;
    this.windowChange.emit(data);
  }
}
