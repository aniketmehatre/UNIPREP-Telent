import {Component, OnInit} from '@angular/core';
import { FaqService } from './faq.service';

@Component({
    selector: 'uni-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
    faqcatlist: any[] = [];
    faqanswelist: any[] = [];
    constructor(private service: FaqService) {
    }

    ngOnInit(): void {
        this.getfaqlist()
    }
    getfaqlist() {
        this.faqcatlist=[];
        this.service.Getfaqlist().subscribe((res) => {
          this.faqcatlist = res.data;      
       this.onFaqcatClick(res.data[0].id)
       
        }) 
      }
    
      onFaqcatClick(id:any){ 
        this.faqanswelist=[];
          var data={
            category:id
          }
        
        this.service.Getfaqlistwithcate(data).subscribe((res) => {
          this.faqanswelist=res.data
           })
      }
}
