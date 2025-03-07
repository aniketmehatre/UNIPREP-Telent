import { Component, ElementRef, OnInit } from "@angular/core"
import { ValidcertificatesService } from "./validcertificates.service"
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { DomSanitizer, Meta, SafeResourceUrl } from "@angular/platform-browser"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
import { InputTextModule } from "primeng/inputtext"
@Component({
	selector: "uni-certificates",
	templateUrl: "./certificates.component.html",
	styleUrls: ["./certificates.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule],
})
export class CertificatesComponent implements OnInit {
	certificateValidOrInvalid: SafeResourceUrl | null = null
	certificateforcopy: any
	form!: FormGroup
	certificateAvailable: boolean = false
	certificateStatus: any
	certificatecount: number = 0
	constructor(private service: ValidcertificatesService, public fb: FormBuilder, private sanitizer: DomSanitizer, private meta: Meta, private toast: MessageService, private elementRef: ElementRef) {}

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
				this.certificateValidOrInvalid = this.sanitizer.bypassSecurityTrustResourceUrl(res.certificatelink)
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
	shareViaInstagram(link: any) {
		let url = this.certificateforcopy;
		this.meta.updateTag({ property: "og:url", content: url });
		// Instagram doesn't have a direct sharing API like other platforms
		// Redirecting to Instagram with the URL copied to clipboard might be better
		// For mobile, you can use the instagram:// URL scheme
		navigator.clipboard.writeText(url).then(() => {
			window.open('https://www.instagram.com/', '_blank');
			// Alternative for mobile: window.open('instagram://', '_blank');
		});
	}

	shareViaFacebook(link: any) {
		let url = this.certificateforcopy;
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&amp;src=sdkpreparse"`;
		window.location.href = shareUrl;
	}

	shareViaLinkedIn(link: any) {
		let url = this.certificateforcopy;
		const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
		window.location.href = shareUrl;
	}

	shareViaTwitter(link: any) {
		let url = this.certificateforcopy;
		const text = "Check out this certificate"; // Optional text to accompany the URL
		const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		window.location.href = shareUrl;
	}

	shareViaMail(link: any) {
		let url = this.certificateforcopy;
		const subject = "My Certificate"; // Optional subject line
		const body = `Check out my certificate: ${url}`;
		const shareUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.location.href = shareUrl;
	}

	copyLink(link: any) {
		const sanitizedCertificate = this.certificateforcopy || ""
		const textarea = document.createElement("textarea")
		textarea.textContent = sanitizedCertificate
		document.body.append(textarea)
		textarea.select()
		document.execCommand("copy")
		textarea.remove()
		this.toast.add({ severity: "success", summary: "Success", detail: "Certificate link Copied" })
	}
}
