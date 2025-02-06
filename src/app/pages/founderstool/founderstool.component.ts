import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-founderstool',
    templateUrl: './founderstool.component.html',
    styleUrls: ['./founderstool.component.scss'],
    standalone: false
})
export class FounderstoolComponent implements OnInit {

  constructor(  private pageFacade: PageFacadeService, private router:Router) { }

  ngOnInit(): void {
  }
}
