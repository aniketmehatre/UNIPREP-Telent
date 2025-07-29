import { Component, OnInit } from "@angular/core"
import { MycertificateserviceService } from "./mycertificateservice.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { AuthService } from "src/app/Auth/auth.service"
import { DataService } from "src/app/services/data.service"
import { Meta } from "@angular/platform-browser"
import { MessageService } from "primeng/api"
import { PageFacadeService } from "../page-facade.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { StorageService } from "../../services/storage.service"
import { SocialShareService } from "src/app/services/social-share.service"
import { ButtonModule } from "primeng/button"

@Component({
	selector: "uni-mycertificate",
	templateUrl: "./mycertificate.component.html",
	styleUrls: ["./mycertificate.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, ButtonModule],
})
export class MycertificateComponent implements OnInit {
	certificatesList: any[] = []
	learninghubcertificatelist: any[] = []
	totalmodulecirtficatelist: any[] = []
	laguageCertificate: any[] = []
	othercirtificatecountrylist: any = ""
	countryname: any

	constructor(private service: MycertificateserviceService, private router: Router,
		private dataService: DataService, private meta: Meta, private route: ActivatedRoute,
		private pageFacade: PageFacadeService, private socialShareService: SocialShareService, private storage: StorageService) { }

	ngOnInit(): void {
		this.dataService.countryNameSource.subscribe((data) => {
			this.countryname = data
		})
		this.route.params.subscribe((params) => {
			let socialShare: any = document.getElementById("socialSharingList")
			if (socialShare) {
				socialShare.style.display = "none"
			}
			//this.getSubmoduleName(this.countryId);
		})
		this.getCertificates()
		this.getCertificateoOtherCountry()
	}
	getCertificateoOtherCountry() {
		this.othercirtificatecountrylist = ""
		var data = {
			countryid: Number(this.storage.get("countryId")),
			// countryid:null
		}
		this.service.getCertificateInOtherCountry(data).subscribe((res) => {
			this.othercirtificatecountrylist = res.countries
			console.log(res)
		})
	}
	getCertificates() {
		this.certificatesList = []
		this.learninghubcertificatelist = []
		var data = {
			// countryid:null
		}
		this.service.getUserCompletedCertificate(data).subscribe((res) => {
			this.certificatesList = res.certificates
			this.totalmodulecirtficatelist = [...this.certificatesList, ...this.learninghubcertificatelist, ...this.laguageCertificate]
			console.log(this.totalmodulecirtficatelist)
		})
		// var data1={
		//   countryid:0,
		//   moduleid :8
		// }
		// this.service.getUserCompletedCertificate(data1).subscribe((res)=>{
		//   this.learninghubcertificatelist=res.certificates;
		//   this.totalmodulecirtficatelist=[...this.certificatesList,...this.learninghubcertificatelist,...this.laguageCertificate];
		//   console.log(this.totalmodulecirtficatelist);
		// })
		// var data2={
		//   countryid:0,
		//   moduleid :9
		// }
		// this.service.getUserCompletedCertificate(data2).subscribe((res)=>{
		//   this.laguageCertificate=res.certificates;
		//   this.totalmodulecirtficatelist=[...this.certificatesList,...this.learninghubcertificatelist,...this.laguageCertificate];
		//   console.log(this.totalmodulecirtficatelist);
		// })
	}
	downloadCertificate(link: any, module_id: any) {
		window.open(link, "_blank")
	}

	selectedIndex: any = null
	showSocialSharingList(index: any, module_id: any) {
		this.selectedIndex = this.selectedIndex === index ? null : index
	}

	shareQuestion(link: string, type: string) {
		const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
		const url = encodeURI(link);
		this.meta.updateTag({ property: 'og:url', content: url });
		const shareUrl = socialMedias[type] + encodeURIComponent(url);
		window.open(shareUrl, '_blank');
	}

	copyLink(link: string) {
		const textToCopy = encodeURI(link);
		this.socialShareService.copyQuestion(textToCopy, 'Certificate link Copied');
	}

	redirectCertificateTraker() {
		const url = this.router.serializeUrl(this.router.createUrlTree(["/certificates"]))
		window.open(url, "_blank")
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("certification")
	}
}
