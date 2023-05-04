import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SopSampleService} from '../sop-sample.service';

@Component({
    selector: 'uni-sop-list',
    templateUrl: './sop-list.component.html',
    styleUrls: ['./sop-list.component.scss']
})
export class SopListComponent implements OnInit {

    getsopsmplList: any;
    url: any;

    constructor(private sopSample: SopSampleService, private router: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.initialdataLoad();

    }

    initialdataLoad() {
        this.router.params.subscribe((response: any) => {
            this.url = "" + response?.url;
            this.sopSample.getSoplist(this.url).subscribe((response: any) => {
                this.getsopsmplList = response.data;
            })
        })


    }
}