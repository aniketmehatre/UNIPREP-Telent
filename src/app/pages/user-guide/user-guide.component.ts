import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {

  constructor() { }
  
  guideList = [ 
      { id:1, title : 'Automatic renewal'}, { id:2, title : 'Subscription invoices'},
      { id:3, title : 'Rejected and declined payments'},{ id:4, title : 'SOP checker Premium Plans'},
      { id:5, title : 'Payments methods'},{ id:6, title : 'Changes payment method'},
      { id:7, title : 'Automatic renewal cancellation'},{ id:7, title : 'Subscription upgrade'},
      { id:9, title : 'Automatic renewal cancellation'}]

  ngOnInit(): void {
  }

}
