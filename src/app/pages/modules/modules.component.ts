import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
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
