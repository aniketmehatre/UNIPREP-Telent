import { Component, OnInit } from '@angular/core';
import { ValidcertificatesService } from './validcertificates.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'uni-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  certificateValidOrInvalid:any;
  form!: FormGroup;
  constructor(private service:ValidcertificatesService,public fb: FormBuilder,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      certificateid: ["",Validators.required],
    });

  }
  certificateValid(){
    var data={
      certificateID:this.form.value.certificateid
    }
    this.service.getValidCertificates(data).subscribe((res) => {
      this.certificateValidOrInvalid = this.sanitizer.bypassSecurityTrustResourceUrl(res.certificatelink);
    })
  }
  get f() {
    return this.form.controls;
  }
}
