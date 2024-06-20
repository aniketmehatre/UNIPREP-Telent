import { Component, OnInit } from '@angular/core';
import { ValidcertificatesService } from './validcertificates.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, Meta, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  certificateValidOrInvalid: SafeResourceUrl | null = null;
  form!: FormGroup;
  certificateAvailable: boolean = false;
  certificateStatus:any
  constructor(
    private service: ValidcertificatesService,
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private toast: MessageService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      certificateid: ["", Validators.required],
    });
  }

  certificateValid(): void {
    const data = {
      certificateID: this.form.value.certificateid
    };
    
    this.service.getValidCertificates(data).subscribe((res) => {
      if (res && res.certificatelink) {
        this.certificateValidOrInvalid = this.sanitizer.bypassSecurityTrustResourceUrl(res.certificatelink);
        this.certificateStatus=res.status;
        this.certificateAvailable = true;
      } else {
        this.certificateAvailable = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }
  selectedIndex: any = null;
  showSocialSharingList(index: any):void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }
  shareViaWhatsapp(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
    console.log(shareUrl);
    
  }
  shareViaInstagram(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  copyLink(link:any){
    const textarea = document.createElement('textarea');

    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    textarea.textContent = link
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Certificate link Copied' });
  }
}
