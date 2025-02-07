import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'uni-modules',
    templateUrl: './modules.component.html',
    styleUrls: ['./modules.component.scss'],
    standalone: true,
    imports: [RouterModule, CommonModule]
})
export class ModulesComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit(): void {
    if(window.location.pathname.includes("&&")) {
      let url = window.location.pathname.split("&&");
      localStorage.setItem('questionId', url[1]);
      localStorage.setItem('countryId',url[2]);
      this.router.navigateByUrl(url[0]);
      
    }
  }

}
