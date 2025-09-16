import { Component, OnInit } from "@angular/core"
import { FaqService } from "./faq.service"
import { CommonModule } from "@angular/common"
import { AccordionModule } from "primeng/accordion"
import { RouterModule } from "@angular/router"
import { MatExpansionModule } from "@angular/material/expansion"
@Component({
	selector: "uni-faq",
	templateUrl: "./faq.component.html",
	styleUrls: ["./faq.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule,MatExpansionModule],
})
export class FaqComponent implements OnInit {
	faqcatlist: any[] = []
	faqanswelist: any[] = []
	activeCategory: any = null
	activeIndex: number | null = null;
	constructor(private service: FaqService) { }

	ngOnInit(): void {
		this.getfaqlist()
	}
	getfaqlist() {
		this.faqcatlist = []
		var data = {
			usertype: 1,
			page: 1,
			perpage: 10000,
		}
		this.service.Getfaqlist(data).subscribe((res) => {
			this.faqcatlist = res.data
			this.onFaqcatClick(res.data[0].id)
		})
	}

	onFaqcatClick(id: any) {
		this.faqanswelist = [] // Clear the faqanswelist array when a category is clicked
		var data = {
			category: id,
		}
		this.activeCategory = id // Set the active category to the clicked ID
		this.service.Getfaqlistwithcate(data).subscribe((res) => {
			this.faqanswelist = res.data // Update faqanswelist with the retrieved data
		})
	}
}
