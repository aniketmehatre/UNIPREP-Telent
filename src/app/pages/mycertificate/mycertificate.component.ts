import { Component, OnInit } from "@angular/core"
import { MycertificateserviceService } from "./mycertificateservice.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { AuthService } from "src/app/Auth/auth.service"
import { DataService } from "src/app/data.service"
import { Meta } from "@angular/platform-browser"
import { MessageService } from "primeng/api"
import { PageFacadeService } from "../page-facade.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { StorageService } from "../../storage.service"
import { SocialShareService } from "src/app/shared/social-share.service"
@Component({
	selector: "uni-mycertificate",
	templateUrl: "./mycertificate.component.html",
	styleUrls: ["./mycertificate.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule],
})
export class MycertificateComponent implements OnInit {
	certificatesList: any[] = []
	learninghubcertificatelist: any[] = []
	totalmodulecirtficatelist: any[] = []
	laguageCertificate: any[] = []
	othercirtificatecountrylist: any = ""
	countryname: any
	planExpired: boolean = false
	studentplanRestrict: boolean = false

	constructor(private service: MycertificateserviceService, private router: Router, private authService: AuthService,
		private dataService: DataService, private meta: Meta, private toast: MessageService, private route: ActivatedRoute,
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
		this.checkplanExpire()
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
		if (module_id == 8 || module_id == 10) {
			if (this.studentplanRestrict) {
				this.authService.hasUserSubscription$.next(true);
				return
			}
		} else {
			if (this.planExpired) {
				this.authService.hasUserSubscription$.next(true);
				return
			}
		}
		window.open(link, "_blank")
	}

	checkplanExpire(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
			this.authService._userSubscrition.subscription_details.subscription_plan === "Student") {
			this.studentplanRestrict = true;
		}
		else {
			this.studentplanRestrict = false;
		}
	}
	selectedIndex: any = null
	showSocialSharingList(index: any, module_id: any) {
		if (module_id == 8 || module_id == 10) {
			if (this.studentplanRestrict) {
				this.authService.hasUserSubscription$.next(true);
				return
			}
		} else {
			if (this.planExpired) {
				this.authService.hasUserSubscription$.next(true);
				return
			}
		}
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

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
}
