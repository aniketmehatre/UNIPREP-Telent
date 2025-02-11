import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'uni-editprofile',
    templateUrl: './editprofile.component.html',
    styleUrls: ['./editprofile.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class EditprofileComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
