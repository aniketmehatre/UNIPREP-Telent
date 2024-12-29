import { Component, ElementRef, HostListener, NgModule, OnInit, ViewChild } from '@angular/core';
import { TutorialsService } from './tutorials.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'uni-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})

export class TutorialsComponent implements OnInit {
  @ViewChild('videoFrame') videoFrame: ElementRef | undefined;
  tutorials:any=[];
  tutoriallist:any=[];
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  categorylist:any=[];
  selectedCategoryId: number | null = null; 
  categoryextra:any;
  constructor(private resourceService: TutorialsService,private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    var data={
      // usertype:1,
      category:null
    }
    this.resourceService.getResources(data).subscribe((response:any)=>{
      var tutorials= response.Tutorial;
      tutorials.forEach((element:any) => {
         var tutorial = {
          title: element.title,
          link: element.link,
          coverimage:element.coverimage,
          description:element.description
         }
         this.tutoriallist.push(tutorial);
      });
    });
    this.resourceService.getCatogory().subscribe((response:any)=>{
      this.categoryextra = [{ id: null, name: "All" }];
      this.categorylist= [...this.categoryextra,...response.data];
    });
  }
  openNextPageLink:any;
  openVideoPopup(link: any): void {
    this.openNextPageLink=link
    // Check if it's a YouTube video link
    if (this.isYoutubeVideoLink(link)) {
      // If it's a YouTube video link, extract the video ID and construct the embeddable URL
      const videoId = this.extractYoutubeVideoId(link);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      // If it's not a YouTube video link, use the URL directly
      this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }
  
    // Set the flag to show the modal
    this.showVideoPopup = true;
  }  

  private isYoutubeVideoLink(link: string): boolean {
    // Check if the link is a YouTube video link based on a simple pattern
    return link.includes('youtube.com') || link.includes('youtu.be');
  }

  private extractYoutubeVideoId(url: string): string {
    const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is the Escape key (code 27)
    if (event.code === 'Escape') {
      this.closeVideoPopup();
    }
  }
  closeVideoPopup(): void {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = '';
    }
     this.selectedVideoLink = null;
     this.showVideoPopup = false;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  openNextVideo(){
    window.open(this.openNextPageLink)
  }
  filterCat(id:any){
    this.tutoriallist=[];
    var data={
      // usertype:1,
      category:id
    }
    this.resourceService.getResources(data).subscribe((response:any)=>{
      var tutorials= response.Tutorial;
      tutorials.forEach((element:any) => {
         var tutorial = {
          title: element.title,
          link: element.link,
          coverimage:element.coverimage,
          description:element.description
         }
         this.tutoriallist.push(tutorial);
         this.selectedCategoryId = id;
      });
    });
  }
  isSelected(id: number): boolean {
    return this.selectedCategoryId === id;  // Check if this category is selected
  }
}
// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(private sanitizer: DomSanitizer) { }

//   transform(url: string): SafeResourceUrl {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }