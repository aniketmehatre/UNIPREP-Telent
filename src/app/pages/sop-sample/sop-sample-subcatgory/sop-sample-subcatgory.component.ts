import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SopSampleService } from '../sop-sample.service';

@Component({
  selector: 'uni-sop-sample-subcatgory',
  templateUrl: './sop-sample-subcatgory.component.html',
  styleUrls: ['./sop-sample-subcatgory.component.scss']
})
export class SopSampleSubcatgoryComponent implements OnInit {

  constructor(private sopSample:SopSampleService, private router: ActivatedRoute,public route: Router,) { }
    getsopsmplsubData:any;
    routerurl:any;
  ngOnInit(): void {
    this.initialdataLoad();
    
  }
  initialdataLoad(){
    this.router.params.subscribe((response:any)=>{
      this.routerurl = ""+response?.url;
      this.sopSample.getsubCatgorySop(this.routerurl).subscribe((response:any)=>{
        this.getsopsmplsubData = response.data;
       
       
    })
    })
   
   

}
}