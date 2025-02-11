import {Component, OnInit} from '@angular/core';
import {HelpServiceService} from "../help-service.service";
import {MessageService} from "primeng/api";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'uni-support-card',
    templateUrl: './support-card.component.html',
    styleUrls: ['./support-card.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class SupportCardComponent implements OnInit {

    helpCategoryData: any;

    constructor(private helpServiceService: HelpServiceService, private toast: MessageService) {
    }

    ngOnInit(): void {
        this.helpServiceService.getHelpSupportCategoryList().subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.helpCategoryData = res.helpcategories;
        }, err => {
            this.toast.add({severity: 'info', summary: 'Alert', detail: err});
        });
    }
}
