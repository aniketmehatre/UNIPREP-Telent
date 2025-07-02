import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { PageFacadeService } from "../../page-facade.service"
import { Meta } from "@angular/platform-browser"
import { SalaryHacksService } from "../salaryhacks.service"
import { DialogModule } from "primeng/dialog"
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { DataService } from "src/app/data.service";
import { SkeletonModule } from "primeng/skeleton";
import { SocialShareService } from "src/app/shared/social-share.service"
import { ObjectModel } from "src/app/@Models/object.model"
@Component({
	selector: "uni-salaryhackslists",
	templateUrl: "./salaryhackslists.component.html",
	styleUrls: ["./salaryhackslists.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule]
})
export class SalaryhacksListsComponent {
	isSkeletonVisible: boolean = true;
	isQuestionAnswerVisible: boolean = false;
	page: number = 1;
	perpage: number = 50;
	totalDataCount: any = 0;
	ListData: any = [];
	selectedQuestionData: any;
	module_id: any;
	@Input() prepData: any;
	@Output() windowChange = new EventEmitter();
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index);
	constructor(
		private pageFacade: PageFacadeService,
		private meta: Meta,
		private service: SalaryHacksService,
		private dataService: DataService,
		private socialShareService: SocialShareService
	) { }

	ngOnInit(): void {
		this.gethackList();
	}

	onShowModal(value: any) {
		let socialShare: any = document.getElementById("socialSharingList");
		socialShare.style.display = "none";
	}

	gethackList() {
		let data: ObjectModel = {
			country_id: this.prepData.country_id,
			page: this.page,
			perpage: this.perpage,
		}
		if (this.prepData.question_id) {
			data['question_id'] = this.prepData.question_id;
		}
		this.service.getSalaryegotitationhacks(data).subscribe((response) => {
			this.ListData = response.data;
			this.module_id = response.module_id;
			this.totalDataCount = response.totalcount;
			this.isSkeletonVisible = false;
			if(this.prepData.question_id){
				this.prepData.question_id = 0;
				this.prepData.countryName = this.ListData[0].country_name;
				this.readSavedResponse(this.ListData[0]);
			}
		});
	}
	goToHome(event: any) {
		this.isQuestionAnswerVisible = false;
	}
	backtoMain() {
		this.windowChange.emit({ stage: 1 });
	}
	paginate(event: any) {
		this.page = event.page + 1;
		this.perpage = event.rows;
		this.gethackList();
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("salary-negotiation-hacks")
	}

	showSocialSharingList() {
		let socialShare: any = document.getElementById("socialSharingList")
		if (socialShare.style.display == "") {
			socialShare.style.display = "block"
		} else {
			socialShare.style.display = socialShare.style.display == "none" ? "block" : "none"
		}
	}

	shareQuestion(type: string) {
		const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
		const url = encodeURI(window.location.origin + '/pages/salary-hacks/' + this.prepData.country_id + '/' + this.selectedQuestionData?.id);
		this.meta.updateTag({ property: 'og:url', content: url });
		const shareUrl = socialMedias[type] + encodeURIComponent(url);
		window.open(shareUrl, '_blank');
	}

	copyLink() {
		const textToCopy = encodeURI(window.location.origin + '/pages/salary-hacks/' + this.prepData.country_id + '/' + this.selectedQuestionData?.id);
		this.socialShareService.copyQuestion(textToCopy);
	}

	readSavedResponse(selectedData: any) {
		this.selectedQuestionData = selectedData
		this.isQuestionAnswerVisible = true
	}
	getContentPreview(content: string): string {
		const plainText = content.replace(/<[^>]*>/g, "")
		return plainText.length > 75 ? plainText.slice(0, 75) + " ..." : plainText
	}
	openReport() {
		let data: any = {
			isVisible: true,
			moduleId: this.module_id,
			questionId: this.selectedQuestionData?.id,
			countryId: this.selectedQuestionData.country_id,
		};
		this.dataService.openReportWindow(data);
	}
}