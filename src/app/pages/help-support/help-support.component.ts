import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
@Component({
    selector: 'uni-help-support',
    templateUrl: './help-support.component.html',
    styleUrls: ['./help-support.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule]
})
export class HelpSupportComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
