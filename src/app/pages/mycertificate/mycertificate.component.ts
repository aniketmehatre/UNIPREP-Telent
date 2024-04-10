import { Component, OnInit } from '@angular/core';
import { MycertificateserviceService } from './mycertificateservice.service';

@Component({
  selector: 'uni-mycertificate',
  templateUrl: './mycertificate.component.html',
  styleUrls: ['./mycertificate.component.scss']
})
export class MycertificateComponent implements OnInit {

  constructor(private service:MycertificateserviceService) { }

  ngOnInit(): void {
  }
  getCertificates(){
    var data={
      countryid:Number(localStorage.getItem('countryId'))
    }
    this.service.getupcommingevent(data).subscribe((res)=>{
      console.log(res);
    })
  }
}
