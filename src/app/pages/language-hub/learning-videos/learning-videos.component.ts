import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Location } from "@angular/common";
import { LanguageHubDataService } from "../language-hub-data.service";
import { Router } from "@angular/router";
import { PageFacadeService } from "../../page-facade.service";
import { LanguageArrayGlobalService } from "../language-array-global.service";
import { AuthService } from "src/app/Auth/auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { LanguageHubService } from "../language-hub.service";

@Component({
    selector: "uni-learning-videos",
    templateUrl: "./learning-videos.component.html",
    styleUrls: ["./learning-videos.component.scss"],
    standalone: false
})
export class LearningVideosComponent implements OnInit {
  @ViewChild("videoFrame") videoFrame: ElementRef | undefined;
  isSkeletonVisible: boolean = true;
  openNextPageLink: any;
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  selectedLanguageId: any;
  tutorialList: any;
  selectedLanguageName: string = "";

  constructor(
    private lhs: LanguageHubDataService,
    private location: Location,
    private pageFacade: PageFacadeService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private languageHubService: LanguageHubService,
    private languageArrayGlobalService: LanguageArrayGlobalService
  ) {
    this.lhs.data$.subscribe((data) => {
      this.selectedLanguageId = data;
    });

    this.lhs.dataLanguageName$.subscribe((data) => {
      this.selectedLanguageName = data;
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.languageHubService
      .learningVideos(this.selectedLanguageId)
      .subscribe((_res) => {
        this.isSkeletonVisible = false;
        this.tutorialList = _res;
      });
  }

  getFormattedValues(): string {
    return this.languageArrayGlobalService.getItems().join(" -> ");
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  goToHome(event: any) {
    this.languageArrayGlobalService.removeItem(
      this.languageArrayGlobalService.getItems().length - 1
    );
    this.location.back();
  }

  openVideoPopupNew(link: any): void {
    this.openNextPageLink = link;
    // Check if it's a YouTube video link
    if (this.isYoutubeVideoLink(link)) {
      // If it's a YouTube video link, extract the video ID and construct the embeddable URL
      const videoId = this.extractYoutubeVideoId(link);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.selectedVideoLink =
        this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      // If it's not a YouTube video link, use the URL directly
      this.selectedVideoLink =
        this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }

    // Set the flag to show the modal
    this.showVideoPopup = true;
  }

  private isYoutubeVideoLink(link: string): boolean {
    // Check if the link is a YouTube video link based on a simple pattern
    return link.includes("youtube.com") || link.includes("youtu.be");
  }

  private extractYoutubeVideoId(url: string): string {
    const videoIdRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : "";
  }

  @HostListener("document:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is the Escape key (code 27)
    if (event.code === "Escape") {
      this.closeVideoPopup();
    }
  }
  closeVideoPopup(): void {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = "";
    }
    this.selectedVideoLink = null;
    this.showVideoPopup = false;
  }

  openNextVideo() {
    window.open(this.openNextPageLink);
  }
}
