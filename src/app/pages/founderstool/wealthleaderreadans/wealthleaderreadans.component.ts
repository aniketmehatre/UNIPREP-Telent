import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';

@Component({
  selector: 'uni-wealthleaderreadans',
  templateUrl: './wealthleaderreadans.component.html',
  styleUrls: ['./wealthleaderreadans.component.scss']
})
export class WealthleaderreadansComponent implements OnInit {
  wealthleadersname:any;
  perpage: number = 50;
  pageno: number = 1;
  totalcount: number = 0;
  idleader:any;
  wealthleadersqueslist:any[]=[];
  constructor(private router:Router,private pageFacade: PageFacadeService,
    private service: FounderstoolService,private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.wealthleadersname=localStorage.getItem("wealthleadersname")
    this.idleader = this.route.snapshot.paramMap.get('id');
    this.getWealthLeaders();
  }
  goBack(){
    this.router.navigate(['/pages/founderstool/wealthleaderslist']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  seeAnswer(){

  }
  getWealthLeaders(){
    var data={
      page:this.pageno,
      perPage:this.perpage,
      wealth_leader_id:this.idleader,
      // search:this.valueNearYouFilter
    }
    this.service.wealthLeadersquestion(data).subscribe((res)=>{
      this.wealthleadersqueslist=res.data;
      this.totalcount=res.total_count;
      // this.wealthleaderlist=res.data;
      // this.totalcount = res.total_count
      // this.newfile = "none";
    })
  }
}
