import {Component, OnInit} from '@angular/core';
import {JobSearchService} from "../job-search.service";
import {Router} from "@angular/router";
import {DataService} from "../../../data.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";

interface Status {
    label: string;
    value: string;
    color: string;
}

@Component({
    selector: 'uni-job-board',
    templateUrl: './job-board.component.html',
    styleUrls: ['./job-board.component.scss']
})
export class JobBoardComponent implements OnInit {
    addManual: FormGroup
    isDeleteVisible: boolean = false
    isVisibleAddManually: boolean = false
    dataGoingToDelete: any
    singleData: any
    isDetailsCardVisible: boolean = false
    jobs: any[] = []
    statuses: Status[] = [
        {label: 'Applied', value: 'apply', color: 'blue'},
        {label: 'Shortlisted', value: 'shortlist', color: 'yellow'},
        {label: 'Rejected', value: 'rejected', color: 'red'},
        {label: 'Accepted', value: 'accepted', color: 'green'}
    ];

    constructor(private jobService: JobSearchService, private _location: Location, private dataService: DataService) {
        this.dataService.manualJobAdd.subscribe(data => {
            if (data) {
                this.isVisibleAddManually = true;
            }
        });
        this.addManual = new FormGroup({
            company_name: new FormControl(''),
            company_url: new FormControl(''),
            job_title: new FormControl(''),
            job_url: new FormControl(''),
            list_date: new FormControl(''),
            location: new FormControl(''),
            price: new FormControl(''),
            work_type: new FormControl(''),
            time: new FormControl(''),
            type: new FormControl(''),
            country_flag: new FormControl(''),
            status: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.init()
    }

    init() {
        this.jobService.getJobTracker().subscribe(
            (data: any) => {
                this.jobs = data.value
            },
            (error) => {
                console.error('not able to apply:', error);
            }
        );
    }

    onStatusChange(job: any, event: any) {
        //job.type = event.value;
        const jobDetails = {
            jobtracker_id: job.id,
            type: event.value
        };
        this.jobService.updateJobStatusList(jobDetails).subscribe(
            (data: any) => {
                this.init()
            },
            (error) => {
                console.error('not able to apply:', error);
            }
        );
    }

    getJobsByStatus(status: string): any[] {
        return this.jobs.filter(job => job.type === status);
    }

    clearRestriction(){
        this.isVisibleAddManually = false
        this.isDeleteVisible = false
    }

    onSubmit(){
        const jobDetails = {
            company_name: this.addManual.value.company_name,
            company_url: '',
            job_title: this.addManual.value.job_title,
            job_url: '',
            list_date: new Date(),
            location: this.addManual.value.location,
            price: '',
            work_type: '',
            time: '',
            type: this.addManual.value.status.value,
            country_flag: '',
            description: ''
        };
        this.jobService.addJobStatusList(jobDetails).subscribe(
            (data: any) => {
                this.init()
                this.isVisibleAddManually = false
            },
            (error) => {
                console.error('not able to apply:', error);
            }
        );
    }

    onClickDetails(data: any){
        console.log(data)
        this.singleData = data
        this.isDetailsCardVisible = true
    }

    onClickDelete(){
        const jobDetails = {
            jobtracker_id: this.dataGoingToDelete.id,
        };
        this.jobService.deletejobtracker(jobDetails).subscribe(
            (data: any) => {
                this.init()
                this.isDeleteVisible = false
            },
            (error) => {
                console.error('not able to apply:', error);
            }
        );
    }

    onClickDeleteDialog(data: any){
        this.dataGoingToDelete = data
        this.isDeleteVisible = true
    }

    goBack(){
        this.isDetailsCardVisible = false
    }
}
