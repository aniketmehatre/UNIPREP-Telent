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
    activeCategory: any = null;
    constructor(private service: FaqService) {
    }

    ngOnInit(): void {
        this.getfaqlist()
    }
    getfaqlist() {
        this.faqcatlist=[];
        var data={
          usertype:1
        }
        this.service.Getfaqlist(data).subscribe((res) => {
          this.faqcatlist = res.data;      
       this.onFaqcatClick(res.data[0].id)
       
        }) 
      }
    
      onFaqcatClick(id: any) {
        this.faqanswelist = []; // Clear the faqanswelist array when a category is clicked
        var data = {
          category: id
        };
        this.activeCategory = id; // Set the active category to the clicked ID
        this.service.Getfaqlistwithcate(data).subscribe((res) => {
          this.faqanswelist = res.data; // Update faqanswelist with the retrieved data
        });
      }
}
