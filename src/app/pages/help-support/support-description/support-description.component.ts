import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'uni-support-description',
    templateUrl: './support-description.component.html',
    styleUrls: ['./support-description.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class SupportDescriptionComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
