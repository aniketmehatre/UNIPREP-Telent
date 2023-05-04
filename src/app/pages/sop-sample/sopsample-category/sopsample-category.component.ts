import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SopSampleService} from '../sop-sample.service';

@Component({
    selector: 'uni-sopsample-category',
    templateUrl: './sopsample-category.component.html',
    styleUrls: ['./sopsample-category.component.scss']
})
export class SopsampleCategoryComponent implements OnInit {

    routerurl: any;
    getsopsmplData: any;

    constructor(private sopSample: SopSampleService, private router: ActivatedRoute, public route: Router) {
    }

    ngOnInit(): void {
        this.initialdataLoad();
        this.router.params.subscribe((response: any) => {
            this.routerurl = "" + response?.url;
        })

    }

    initialdataLoad() {
        this.sopSample.getsopSample().subscribe((response: any) => {
            this.getsopsmplData = response.data;
        })


    }

    menulink() {
        this.getsopsmplData.forEach((element: any) => {
            let link = element.url

        });
    }
}