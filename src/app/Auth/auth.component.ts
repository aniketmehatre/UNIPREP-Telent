import { Component } from "@angular/core";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: "uni-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent {
  isDeviceStatus: any = 'none'
  isDeviceStatusPopupView: boolean = false
  deviceInfo: any;


  constructor(private deviceService: DeviceDetectorService) {
    this.deviceCheck();
  }
  deviceCheck(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isMobile || isTablet){
      this.isDeviceStatus = 'block';
      this.isDeviceStatusPopupView = false;
    }else{
      this.isDeviceStatus = 'none';
      this.isDeviceStatusPopupView = true;
    }
  }

  moveToDesktop(){
    this.isDeviceStatus = 'none';
    this.isDeviceStatusPopupView = true;
  }
}
