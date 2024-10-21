import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from "../../data.service";
import { Location } from "@angular/common";
@Component({
    selector: 'uni-job-search',
    templateUrl: './job-search.component.html',
    styleUrls: ['./job-search.component.scss']
})

export class JobSearchComponent implements OnInit {

    currentEndpoint: string = '';

    constructor(private router: Router, private _location: Location,
                private route: ActivatedRoute, private dataService: DataService) {
        this.route.params.subscribe(params => {
            const url = this.router.url;
            const urlSegments = url.split('/');
            this.currentEndpoint = urlSegments[urlSegments.length - 1];
        });
    }

    ngOnInit(): void {
        this.getCurrentEndpoint();
    }

    getCurrentEndpoint(): void {
        const url = this.router.url;
        const urlSegments = url.split('/');
        this.currentEndpoint = urlSegments[urlSegments.length - 1];

        // console.log('Current Endpoint:', this.currentEndpoint);
    }

    headerMenuClick(menuName: string) {
        // console.log(menuName);
        this.currentEndpoint = menuName
        if (menuName == "job-search") {
            if (this.getFilterData()) {
                this.router.navigate(['/pages/job-portal/job-listing']);
                return
            }
            this.router.navigate(['/pages/job-portal/job-search']);
        } else if (menuName == "job-tracker") {
            this.router.navigate(['/pages/job-portal/job-tracker']);
        }
        // else if(menuName == "cv-builder"){
        //   this.router.navigate(['/pages/job-portal/cv-builder']);
        // }else if(menuName == "coverletter-builder"){
        //   this.router.navigate(['/pages/job-portal/coverletter-builder']);
        // }
    }

    onClickAddManually() {
        this.dataService.changeManualAdd(true)
    }

    getFilterData(): any {
        const storedData = localStorage.getItem('filterFormData');
        if (storedData) {
            return JSON.parse(storedData);
        }
        return null;
    }

    goBack(){
        this._location.back()
    }
}
