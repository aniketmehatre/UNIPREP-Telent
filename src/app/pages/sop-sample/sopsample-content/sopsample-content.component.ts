import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SopSampleService } from '../sop-sample.service';

@Component({
  selector: 'uni-sopsample-content',
  templateUrl: './sopsample-content.component.html',
  styleUrls: ['./sopsample-content.component.scss']
})
export class SopsampleContentComponent implements OnInit {
  
  constructor(private sopSample:SopSampleService, private router: ActivatedRoute,public route: Router,) { }
    pdfData:any;
    routerurl:any;
  ngOnInit(): void {
    this.initialdataLoad();
    
  }
  initialdataLoad(){
    this.router.params.subscribe((response:any)=>{
      this.routerurl = ""+response?.url;
      this.sopSample.displaypdfconent(this.routerurl).subscribe((response:any)=>{
        this.pdfData = response.data;
       
    })
    })
   
   

}

}

