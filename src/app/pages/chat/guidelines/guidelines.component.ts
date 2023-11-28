import { Component, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ChathistoryService } from "../chat.service";
import { Router } from "@angular/router";

@Component({
  selector: "uni-guidelines",
  templateUrl: "./guidelines.component.html",
  styleUrls: ["./guidelines.component.scss"],
  providers: [ConfirmationService],
})
export class GuidelineComponent implements OnInit {
  messages: any = [];
  accepted=false;
  constructor(private service: ChathistoryService,private route:Router) {}
  ngOnInit(): void {
    // if(localStorage.getItem("guidlineAccepted")){
    //     if(Number(localStorage.getItem("guidlineAccepted"))==1){
    //       this.accepted=true;
    //     }
    //   }
  }
  acceptguideline() {
    this.route.navigate(['/pages/chat']);
    // this.service.Acceptance().subscribe(
    //   (response) => {
    //     window.location.reload();
    //     // this.route.navigate(['/pages/chat']);
    //   },
    //   (error) => {
       
    //   }
    // );
  }
}
