import {Component, inject, signal} from "@angular/core"
import { RouterModule } from "@angular/router"
import { DeviceDetectorService } from "ngx-device-detector"
import { CommonModule } from "@angular/common"
import { ToastModule } from "primeng/toast"
import { SocialLoginModule } from "@abacritt/angularx-social-login"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputGroupModule } from "primeng/inputgroup"
@Component({
	selector: "uni-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, ToastModule, SocialLoginModule, InputGroupAddonModule, InputGroupModule],
})
export class AuthComponent {
	isDeviceStatus: any = "none"
	isDeviceStatusPopupView: boolean = false
	deviceInfo: any

	constructor(private deviceService: DeviceDetectorService) {
		this.deviceCheck()
	}
	deviceCheck() {
		this.deviceInfo = this.deviceService.getDeviceInfo()
		const isMobile = this.deviceService.isMobile()
		const isTablet = this.deviceService.isTablet()
		if (isMobile || isTablet) {
			this.isDeviceStatus = "block"
			this.isDeviceStatusPopupView = false
		} else {
			this.isDeviceStatus = "none"
			this.isDeviceStatusPopupView = true
		}
	}

	moveToDesktop() {
		this.isDeviceStatus = "none"
		this.isDeviceStatusPopupView = true
	}
}
