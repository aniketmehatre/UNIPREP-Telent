import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
@Component({
    selector: 'uni-founderstool',
    templateUrl: './founderstool.component.html',
    styleUrls: ['./founderstool.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class FounderstoolComponent implements OnInit {

  constructor(  private pageFacade: PageFacadeService, private router:Router) { }

  ngOnInit(): void {
  }
}
