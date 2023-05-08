import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {DataService} from "../../data.service";

@Component({
    selector: 'uni-header-search',
    templateUrl: './header-search.component.html',
    styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit {
    message: any
    countryName: any
    isSearchResultFound: boolean = false;
    searchResult: any;

    constructor(private dashboardService: DashboardService, private dataService: DataService) {
        this.dataService.chatTriggerSource.subscribe(message => {
            this.message = message;
        });
        this.dataService.countryNameSource.subscribe(countryName => {
            this.countryName = countryName;
        });
    }

    ngOnInit(): void {
    }

    onSearchChange(event: any) {
        event == "" ? this.isSearchResultFound = false : '';
    }

    searchKeyWord(searchInput: any) {
        const data = {
            countryId: Number(localStorage.getItem('countryId')),
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
    openChat(){
        this.dataService.changeChatOpenStatus("open chat window");
    }
}
