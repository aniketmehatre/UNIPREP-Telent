import { Component, OnInit } from '@angular/core';
import { TutorialsService } from './tutorials.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'uni-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit {
//   @Pipe({
//   name: 'safe'
// })
  tutorials:any=[];
  tutoriallist:any=[];
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  constructor(private resourceService: TutorialsService,private sanitizer: DomSanitizer) { }

  transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
  ngOnInit(): void {
    this.resourceService.getResources().subscribe((response:any)=>{
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
  }

  openVideoPopup(videoLink: string): void {
    // Using DomSanitizer to sanitize the URL as a resource URL
    this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
  }
  closeVideoPopup(): void {
    this.selectedVideoLink = null;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
