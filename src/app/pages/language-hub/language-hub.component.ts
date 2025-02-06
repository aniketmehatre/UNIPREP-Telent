import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'uni-language-hub',
    templateUrl: './language-hub.component.html',
    styleUrls: ['./language-hub.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class LanguageHubComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
