import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'uni-policy',
  imports: [],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss',
  standalone: true
})
export class PolicyComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
  ){}
  policyName!: string;
  policyTitle!: string;
  ngOnInit(){
    this.route.paramMap.subscribe(params =>{
      this.policyName = params.get('name') || "";
      if(this.policyName ==="privacy-policy"){
        this.policyTitle = "Privacy Policy";
      }else if(this.policyName ==="terms-conditions"){
        this.policyTitle = "Terms & Conditions";
      }else if(this.policyName ==="cancellation-policy"){
        this.policyTitle = "Cancellation Policy";
      }else if(this.policyName ==="refund-policy"){
        this.policyTitle = "Refund Policy";
      }else if(this.policyName ==="cookie-policy"){
        this.policyTitle = "Cookie Policy";
      }
    })
  }
}
