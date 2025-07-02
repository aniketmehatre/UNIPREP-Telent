import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core"
import { Location } from "@angular/common"
import { LanguageHubDataService } from "../language-hub-data.service"
import { Router, RouterModule } from "@angular/router"
import { PageFacadeService } from "../../page-facade.service"
import { LanguageArrayGlobalService } from "../language-array-global.service"
import { AuthService } from "src/app/Auth/auth.service"
import { DomSanitizer } from "@angular/platform-browser"
import { LanguageHubService } from "../language-hub.service"
import { CommonModule } from "@angular/common"
import { PaginatorModule } from "primeng/paginator"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { CarouselModule } from "primeng/carousel"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"

@Component({
	selector: "uni-learning-videos",
	templateUrl: "./learning-videos.component.html",
	styleUrls: ["./learning-videos.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, PaginatorModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule],
})
export class LearningVideosComponent implements OnInit {
	@ViewChild("videoFrame") videoFrame: ElementRef | undefined
	isSkeletonVisible: boolean = true
	openNextPageLink: any
	showVideoPopup: boolean = false
	selectedVideoLink: any | null = null
	selectedLanguageId: any
	tutorialList: any
	selectedLanguageName: string = ""

	constructor(private lhs: LanguageHubDataService, private location: Location, private pageFacade: PageFacadeService, public authService: AuthService, private sanitizer: DomSanitizer, private languageHubService: LanguageHubService, private languageArrayGlobalService: LanguageArrayGlobalService) {
		this.lhs.data$.subscribe((data) => {
			this.selectedLanguageId = data
		})

		this.lhs.dataLanguageName$.subscribe((data) => {
			this.selectedLanguageName = data
		})
	}

	ngOnInit() {
		this.init()
	}

	init() {
		this.languageHubService.learningVideos(this.selectedLanguageId).subscribe((_res) => {
			this.isSkeletonVisible = false
			this.tutorialList = _res
		})
	}

	getFormattedValues(): string {
		return this.languageArrayGlobalService.getItems().join(" > ")
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("language-hub")
	}

	goToHome(event: any) {
		this.languageArrayGlobalService.removeItem(this.languageArrayGlobalService.getItems().length - 1)
		this.location.back()
	}

	openVideoPopupNew(link: any): void {
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

	openNextVideo() {
		window.open(this.openNextPageLink)
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
