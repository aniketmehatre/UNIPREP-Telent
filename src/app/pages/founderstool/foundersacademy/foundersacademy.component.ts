import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"
import { FounderstoolService } from "../founderstool.service"
import { Router, RouterModule } from "@angular/router"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { AuthService } from "src/app/Auth/auth.service";
import { PageFacadeService } from "../../page-facade.service"
import { ButtonModule } from "primeng/button"
@Component({
	selector: "uni-foundersacademy",
	templateUrl: "./foundersacademy.component.html",
	styleUrls: ["./foundersacademy.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, ButtonModule],
})
export class FoundersacademyComponent implements OnInit {
	@ViewChild("videoFrame") videoFrame: ElementRef | undefined
	academy: any = []
	academyllist: any = []
	showVideoPopup: boolean = false
	selectedVideoLink: any | null = null
	categorylist: any[] = []
	categoryextra: any
	selectedCategoryId: number | null = null

	constructor(private service: FounderstoolService, private sanitizer: DomSanitizer, private router: Router,
		private authService: AuthService,
		private pageFacade: PageFacadeService
	) { }

	ngOnInit(): void {
		this.filterCat(null)
		this.service.getFounderCategory().subscribe((response: any) => {
			this.categoryextra = [{ id: null, name: "All" }]
			this.categorylist = [...this.categoryextra, ...response.data]
		})
	}
	openNextPageLink: any
	openVideoPopupNew(link: any): void {
		if (this.authService.isInvalidSubscription('founders_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.openNextPageLink = link
		// Check if it's a YouTube video link
		if (this.isYoutubeVideoLink(link)) {
			// If it's a YouTube video link, extract the video ID and construct the embeddable URL
			const videoId = this.extractYoutubeVideoId(link)
			const embedUrl = `https://www.youtube.com/embed/${videoId}`
			this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
		} else {
			// If it's not a YouTube video link, use the URL directly
			this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(link)
		}

		// Set the flag to show the modal
		this.showVideoPopup = true
	}

	private isYoutubeVideoLink(link: string): boolean {
		// Check if the link is a YouTube video link based on a simple pattern
		return link.includes("youtube.com") || link.includes("youtu.be")
	}

	private extractYoutubeVideoId(url: string): string {
		const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/
		const match = url.match(videoIdRegex)
		return match ? match[1] : ""
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("founders-academy");
	}
	@HostListener("document:keydown", ["$event"])
	onKeyDown(event: KeyboardEvent): void {
		// Check if the pressed key is the Escape key (code 27)
		if (event.code === "Escape") {
			this.closeVideoPopup()
		}
	}
	closeVideoPopup(): void {
		if (this.videoFrame && this.videoFrame.nativeElement) {
			const player = this.videoFrame.nativeElement as HTMLIFrameElement
			player.src = ""
		}
		this.selectedVideoLink = null
		this.showVideoPopup = false
	}

	stopPropagation(event: Event): void {
		event.stopPropagation()
	}
	openNextVideo() {
		window.open(this.openNextPageLink)
	}
	filterCat(id: any) {
		if (id) {
			if (this.authService.isInvalidSubscription('founders_tools')) {
				this.authService.hasUserSubscription$.next(true);
				return;
			}
		}
		var data = {
			category: id,
			perpage: 10000,
			page: 1,
		}
		this.service.getAcademy(data).subscribe((response: any) => {
			this.academyllist = []
			var academy = response.founders
			academy.forEach((element: any) => {
				var academy = {
					title: element.title,
					link: element.link,
					coverimage: element.coverimage,
					description: element.description,
				}
				this.academyllist.push(academy)
				this.selectedCategoryId = id
			})
		})
	}
	isSelected(id: number): boolean {
		return this.selectedCategoryId === id // Check if this category is selected
	}
	goBack() {
		this.router.navigate(["/pages/founderstool/founderstoollist"])
	}

	getThumbnailUrl(youtubeUrl: string): string {
		let videoId: string | null = null

		// Check if URL contains "youtu.be/"
		if (youtubeUrl.includes("youtu.be/")) {
			videoId = youtubeUrl.split("youtu.be/")[1].split("?")[0]
		}
		// Check if URL contains "youtube.com/watch?v="
		else if (youtubeUrl.includes("youtube.com/watch?v=")) {
			videoId = youtubeUrl.split("v=")[1].split("&")[0]
		}

		return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""
	}
}
