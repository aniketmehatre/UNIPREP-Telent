import { Component, OnInit, Input } from '@angular/core';
import { SopService } from '../sop.service';
@Component({
  selector: 'app-docpreview',
  templateUrl: './docpreview.component.html',
  styleUrls: ['./docpreview.component.scss']
})
export class DocPreviewComponent implements OnInit {
    
  constructor(private _sopService:SopService) {}
  characters:number=0;
  sentences:number=0;
  lines:number=0;
  docdata:any
  ngOnInit() {
    this.docdata=this._sopService._sopText
  }
}