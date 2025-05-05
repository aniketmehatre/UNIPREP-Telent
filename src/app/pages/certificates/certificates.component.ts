import { Component, ElementRef, OnInit } from "@angular/core"
import { ValidcertificatesService } from "./validcertificates.service"
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { DomSanitizer, Meta, SafeResourceUrl } from "@angular/platform-browser"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
import { InputTextModule } from "primeng/inputtext"
import { SocialShareService } from "src/app/shared/social-share.service"
@Component({
	selector: "uni-certificates",
	templateUrl: "./certificates.component.html",
	styleUrls: ["./certificates.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule],
})
export class CertificatesComponent implements OnInit {
	certificateforcopy: any
	form!: FormGroup
	certificateAvailable: boolean = false
	certificateStatus: any
	certificatecount: number = 0
	constructor(private service: ValidcertificatesService, public fb: FormBuilder, private sanitizer: DomSanitizer,
		private meta: Meta, private toast: MessageService, private socialShareService: SocialShareService) { }

	ngOnInit(): void {
		this.form = this.fb.group({
			certificateid: ["", Validators.required],
		})
	}

	certificateValid(): void {
		const data = {
			certificateID: this.form.value.certificateid,
		}

		this.service.getValidCertificates(data).subscribe((res) => {
			if (res && res.certificatelink) {
				this.certificateforcopy = res.certificatelink
				this.certificateStatus = res.status
				this.certificatecount = res.count
				if (res.count == 1) {
					this.certificateAvailable = true
				} else {
					this.certificateAvailable = false
				}
			} else {
				this.certificateAvailable = false
			}
		})
	}

	get f() {
		return this.form.controls
	}
	selectedIndex: any = null
	showSocialSharingList(index: any): void {
		this.selectedIndex = this.selectedIndex === index ? null : index
	}

	shareQuestion(type: string) {
		const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
		const url = encodeURI(this.certificateforcopy);
		this.meta.updateTag({ property: 'og:url', content: url });
		const shareUrl = socialMedias[type] + encodeURIComponent(url);
		window.open(shareUrl, '_blank');
	}

	copyLink() {
		const textToCopy = encodeURI(this.certificateforcopy);
		this.socialShareService.copyQuestion(textToCopy, 'Certificate link Copied');
	}

}
